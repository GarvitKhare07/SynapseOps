from dataclasses import dataclass

from langchain_text_splitters import RecursiveCharacterTextSplitter

from backend.config import get_settings


@dataclass(frozen=True)
class SourceText:
    text: str
    page: int | None = None


@dataclass(frozen=True)
class TextChunk:
    index: int
    text: str
    page: int | None = None


class ChunkingService:
    def __init__(self) -> None:
        settings = get_settings()
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

    def chunk(self, sources: list[SourceText]) -> list[TextChunk]:
        chunks: list[TextChunk] = []
        for source in sources:
            for part in self.splitter.split_text(source.text):
                stripped = part.strip()
                if stripped:
                    chunks.append(TextChunk(index=len(chunks), text=stripped, page=source.page))
        return chunks


chunking_service = ChunkingService()
