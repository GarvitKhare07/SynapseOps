from typing import Any

import chromadb

from backend.config import get_settings


_client: Any | None = None
_collection: Any | None = None


def init_chroma() -> None:
    global _client, _collection
    settings = get_settings()
    _client = chromadb.PersistentClient(path=str(settings.chroma_persist_dir))
    _collection = _client.get_or_create_collection(
        name=settings.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )


def get_collection() -> Collection:
    if _collection is None:
        raise RuntimeError("ChromaDB is not initialized")
    return _collection
