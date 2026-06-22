from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from backend.config import get_settings
from backend.database.chroma import get_collection
from backend.database.mongo import get_db
from backend.models.schemas import PlantDocument
from backend.services.asset_service import asset_service
from backend.services.chunking_service import chunking_service
from backend.services.embedding_service import embedding_service
from backend.services.extraction_service import extraction_service
from backend.utils.datetime import utc_now_iso
from backend.utils.ids import new_id
from backend.utils.text import safe_filename


SUPPORTED_EXTENSIONS = {"pdf", "docx", "txt"}
SUPPORTED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


class DocumentService:
    async def create_upload(self, file: UploadFile) -> PlantDocument:
        settings = get_settings()
        filename = safe_filename(file.filename or "document")
        extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        mime_type = file.content_type or "application/octet-stream"
        if extension not in SUPPORTED_EXTENSIONS and mime_type not in SUPPORTED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Only PDF, DOCX, and TXT files are supported",
            )

        content = await file.read()
        size = len(content)
        if size > settings.max_upload_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Uploaded file exceeds the configured size limit",
            )

        document_id = new_id("doc")
        storage_path = settings.upload_dir / f"{document_id}_{filename}"
        storage_path.write_bytes(content)
        now = utc_now_iso()
        record = {
            "_id": document_id,
            "id": document_id,
            "name": filename,
            "filename": filename,
            "size": size,
            "mimeType": mime_type,
            "status": "Uploading",
            "progress": 0,
            "uploadedAt": now,
            "errorMessage": None,
            "storagePath": str(storage_path),
        }
        await get_db().documents.insert_one(record)
        return self._to_document(record)

    async def list_documents(self) -> list[PlantDocument]:
        cursor = get_db().documents.find({}).sort("uploadedAt", -1)
        documents: list[PlantDocument] = []
        async for item in cursor:
            documents.append(self._to_document(item))
        return documents

    async def process_document(self, document_id: str) -> None:
        db = get_db()
        document = await db.documents.find_one({"_id": document_id})
        if document is None:
            return

        try:
            await self._set_status(document_id, "Processing", progress=10)
            content = Path(document["storagePath"]).read_bytes()
            sources = extraction_service.extract(content, document["mimeType"], document["name"])
            if not sources:
                raise ValueError("No extractable text was found in the document")

            chunks = chunking_service.chunk(sources)
            if not chunks:
                raise ValueError("No text chunks were produced from the document")

            await self._set_status(document_id, "Processing", progress=45)
            texts = [chunk.text for chunk in chunks]
            embeddings = embedding_service.embed_documents(texts)

            chunk_records = []
            chroma_ids = []
            chroma_metadatas = []
            asset_to_chunk_ids: dict[str, list[str]] = {}
            all_asset_ids: set[str] = set()

            for chunk, embedding in zip(chunks, embeddings, strict=True):
                chunk_id = f"{document_id}_chunk_{chunk.index}"
                asset_ids = asset_service.extract_asset_ids(chunk.text)
                all_asset_ids.update(asset_ids)
                for asset_id in asset_ids:
                    asset_to_chunk_ids.setdefault(asset_id, []).append(chunk_id)

                record = {
                    "_id": chunk_id,
                    "id": chunk_id,
                    "documentId": document_id,
                    "documentName": document["name"],
                    "page": chunk.page,
                    "text": chunk.text,
                    "assetIds": asset_ids,
                }
                chunk_records.append(record)
                chroma_ids.append(chunk_id)
                chroma_metadatas.append(
                    {
                        "documentId": document_id,
                        "documentName": document["name"],
                        "page": chunk.page or -1,
                        "assetIds": ",".join(asset_ids),
                    }
                )

            await self._set_status(document_id, "Processing", progress=75)
            if chunk_records:
                await db.chunks.insert_many(chunk_records)
                get_collection().add(
                    ids=chroma_ids,
                    documents=texts,
                    embeddings=embeddings,
                    metadatas=chroma_metadatas,
                )

            for asset_id, chunk_ids in asset_to_chunk_ids.items():
                await asset_service.upsert_asset_links([asset_id], document_id, chunk_ids)

            await db.documents.update_one(
                {"_id": document_id},
                {
                    "$set": {
                        "status": "Indexed",
                        "progress": 100,
                        "errorMessage": None,
                        "assetIds": sorted(all_asset_ids),
                        "indexedAt": utc_now_iso(),
                    }
                },
            )
        except Exception as exc:
            await self._set_status(document_id, "Failed", progress=100, error_message=str(exc))

    async def _set_status(
        self,
        document_id: str,
        status_value: str,
        progress: int | None = None,
        error_message: str | None = None,
    ) -> None:
        update = {"status": status_value, "errorMessage": error_message}
        if progress is not None:
            update["progress"] = progress
        await get_db().documents.update_one({"_id": document_id}, {"$set": update})

    def _to_document(self, item: dict) -> PlantDocument:
        return PlantDocument(
            id=item["id"],
            name=item["name"],
            size=item["size"],
            mime_type=item["mimeType"],
            status=item["status"],
            progress=item.get("progress"),
            uploaded_at=item["uploadedAt"],
            error_message=item.get("errorMessage"),
        )


document_service = DocumentService()
