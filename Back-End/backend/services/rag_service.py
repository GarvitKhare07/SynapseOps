from typing import Any

from langchain_core.prompts import ChatPromptTemplate

from backend.config import get_settings
from backend.database.chroma import get_collection
from backend.models.schemas import ChatMessage, Citation
from backend.rag.prompts import SYSTEM_PROMPT
from backend.services.asset_service import asset_service
from backend.services.embedding_service import embedding_service
from backend.services.metrics_service import metrics_service
from backend.utils.datetime import utc_now_iso
from backend.utils.ids import new_id
from backend.utils.text import compact_snippet


class RagService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.llm = self._build_llm()

    async def answer(self, prompt: str) -> ChatMessage:
        await metrics_service.increment_ai_queries()
        query_embedding = embedding_service.embed_query(prompt)
        results = get_collection().query(
            query_embeddings=[query_embedding],
            n_results=self.settings.retrieval_top_k,
            include=["documents", "metadatas", "distances"],
        )
        citations = self._build_citations(results)
        related_asset_ids = self._related_assets(prompt, results)
        content = await self._generate_answer(prompt, citations)
        confidence = self._overall_confidence(citations)
        return ChatMessage(
            id=new_id("msg"),
            role="assistant",
            content=content,
            created_at=utc_now_iso(),
            citations=citations,
            confidence=confidence,
            related_asset_ids=related_asset_ids,
        )

    def _build_llm(self) -> Any | None:
        if not self.settings.groq_api_key:
            return None
        try:
            from langchain_groq import ChatGroq
        except ImportError:
            return None
        return ChatGroq(
            api_key=self.settings.groq_api_key,
            model=self.settings.groq_model,
            temperature=self.settings.llm_temperature,
        )

    async def _generate_answer(self, prompt: str, citations: list[Citation]) -> str:
        if not citations:
            return "I could not find indexed source evidence for this question. Upload and index relevant industrial documents, then ask again."

        context = "\n\n".join(
            f"[{index}] {citation.document_name}"
            f"{f' page {citation.page}' if citation.page else ''}: {citation.snippet}"
            for index, citation in enumerate(citations, start=1)
        )
        if self.llm is None:
            evidence_lines = " ".join(f"[{index}] {citation.snippet}" for index, citation in enumerate(citations, start=1))
            return f"Based on the indexed evidence: {evidence_lines}"

        prompt_template = ChatPromptTemplate.from_messages(
            [
                ("system", SYSTEM_PROMPT),
                ("human", "Question:\n{question}\n\nEvidence:\n{context}"),
            ]
        )
        chain = prompt_template | self.llm
        response = await chain.ainvoke({"question": prompt, "context": context})
        return str(response.content)

    def _build_citations(self, results: dict) -> list[Citation]:
        documents = (results.get("documents") or [[]])[0]
        metadatas = (results.get("metadatas") or [[]])[0]
        distances = (results.get("distances") or [[]])[0]
        ids = (results.get("ids") or [[]])[0]

        citations: list[Citation] = []
        for chunk_id, text, metadata, distance in zip(ids, documents, metadatas, distances, strict=False):
            page = metadata.get("page")
            confidence = self._distance_to_confidence(distance)
            citations.append(
                Citation(
                    id=chunk_id,
                    document_id=metadata["documentId"],
                    document_name=metadata["documentName"],
                    page=page if isinstance(page, int) and page > 0 else None,
                    snippet=compact_snippet(text),
                    confidence=confidence,
                )
            )
        return citations

    def _related_assets(self, prompt: str, results: dict) -> list[str]:
        assets = set(asset_service.extract_asset_ids(prompt))
        for metadata in (results.get("metadatas") or [[]])[0]:
            raw_asset_ids = metadata.get("assetIds") or ""
            assets.update(asset_id for asset_id in raw_asset_ids.split(",") if asset_id)
        return sorted(assets)

    def _distance_to_confidence(self, distance: float | None) -> float | None:
        if distance is None:
            return None
        confidence = max(0.0, min(1.0, 1.0 - float(distance)))
        return round(confidence, 3)

    def _overall_confidence(self, citations: list[Citation]) -> float | None:
        values = [citation.confidence for citation in citations if citation.confidence is not None]
        if not values:
            return None
        return round(sum(values) / len(values), 3)


rag_service = RagService()
