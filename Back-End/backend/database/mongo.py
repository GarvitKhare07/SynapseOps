from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from backend.config import get_settings


_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_mongo() -> None:
    global _client, _db
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    _db = _client[settings.mongodb_database]
    await _db.command("ping")
    await _db.documents.create_index("status")
    await _db.documents.create_index("uploadedAt")
    await _db.chunks.create_index("documentId")
    await _db.chunks.create_index("assetIds")
    await _db.assets.create_index("documentIds")
    await _db.metrics.update_one(
        {"_id": "dashboard"},
        {"$setOnInsert": {"aiQueriesRun": 0}},
        upsert=True,
    )


async def close_mongo() -> None:
    global _client, _db
    if _client is not None:
        _client.close()
    _client = None
    _db = None


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("MongoDB is not connected")
    return _db
