from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Industrial Operations Brain API"
    api_prefix: str = ""

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_database: str = "industrial_operations_brain"

    chroma_persist_dir: Path = PROJECT_ROOT / "embeddings"
    chroma_collection: str = "industrial_knowledge_chunks"

    upload_dir: Path = PROJECT_ROOT / "uploads"
    documents_dir: Path = PROJECT_ROOT / "documents"
    max_upload_size_bytes: int = 25 * 1024 * 1024

    chunk_size: int = 1200
    chunk_overlap: int = 180
    retrieval_top_k: int = 5

    groq_api_key: str | None = Field(default=None, validation_alias="GROQ_API_KEY")
    groq_model: str = "llama-3.1-70b-versatile"
    llm_temperature: float = 0.1

    cors_origin: str = "http://localhost:3000"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    settings.documents_dir.mkdir(parents=True, exist_ok=True)
    settings.chroma_persist_dir.mkdir(parents=True, exist_ok=True)
    return settings
