import re
from collections.abc import Iterable

from backend.database.mongo import get_db
from backend.models.schemas import Asset, AssetDetails, RelatedChunk, RelatedDocument


ASSET_PATTERN = re.compile(r"\b[A-Z]{1,5}-\d{2,5}\b")


ASSET_TYPES = {
    "P": "pump",
    "PMP": "pump",
    "MTR": "motor",
    "M": "machine",
    "TK": "tank",
    "V": "valve",
    "CV": "control valve",
}


class AssetService:
    def extract_asset_ids(self, text: str) -> list[str]:
        return sorted(set(ASSET_PATTERN.findall(text.upper())))

    def infer_type(self, asset_id: str) -> str:
        prefix = asset_id.split("-", 1)[0]
        return ASSET_TYPES.get(prefix, "equipment")

    async def upsert_asset_links(
        self,
        asset_ids: Iterable[str],
        document_id: str,
        chunk_ids: Iterable[str],
    ) -> None:
        db = get_db()
        unique_chunk_ids = list(dict.fromkeys(chunk_ids))
        for asset_id in sorted(set(asset_ids)):
            asset_type = self.infer_type(asset_id)
            await db.assets.update_one(
                {"_id": asset_id},
                {
                    "$setOnInsert": {
                        "_id": asset_id,
                        "id": asset_id,
                        "name": asset_id,
                        "type": asset_type,
                        "location": None,
                        "status": "unknown",
                        "tags": [asset_type],
                        "description": None,
                    },
                    "$addToSet": {
                        "documentIds": document_id,
                        "chunkIds": {"$each": unique_chunk_ids},
                    },
                },
                upsert=True,
            )

    async def list_assets(self) -> list[Asset]:
        db = get_db()
        cursor = db.assets.find({}).sort("id", 1)
        assets: list[Asset] = []
        async for item in cursor:
            assets.append(self._to_asset(item))
        return assets

    async def get_asset_details(self, asset_id: str) -> AssetDetails | None:
        db = get_db()
        item = await db.assets.find_one({"_id": asset_id.upper()})
        if item is None:
            return None

        document_ids = item.get("documentIds", [])
        chunk_ids = item.get("chunkIds", [])
        documents_cursor = db.documents.find({"_id": {"$in": document_ids}}).sort("name", 1)
        chunks_cursor = db.chunks.find({"_id": {"$in": chunk_ids}}).sort("documentName", 1)

        related_documents: list[RelatedDocument] = []
        async for document in documents_cursor:
            related_documents.append(
                RelatedDocument(
                    id=document["id"],
                    name=document["name"],
                    type=document["mimeType"],
                )
            )

        related_chunks: list[RelatedChunk] = []
        async for chunk in chunks_cursor:
            page = chunk.get("page")
            related_chunks.append(
                RelatedChunk(
                    id=chunk["id"],
                    document_id=chunk["documentId"],
                    document_name=chunk["documentName"],
                    page=page if isinstance(page, int) and page > 0 else None,
                    text=chunk["text"],
                )
            )

        asset = self._to_asset(item)
        return AssetDetails(
            **asset.model_dump(),
            description=item.get("description"),
            related_documents=related_documents,
            related_chunks=related_chunks,
        )

    def _to_asset(self, item: dict) -> Asset:
        return Asset(
            id=item["id"],
            name=item["name"],
            type=item["type"],
            location=item.get("location"),
            document_count=len(item.get("documentIds", [])),
            status=item.get("status"),
            tags=item.get("tags"),
        )


asset_service = AssetService()
