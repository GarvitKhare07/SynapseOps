from typing import Literal

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


DocumentStatus = Literal["Uploading", "Processing", "Indexed", "Failed"]


class PlantDocument(CamelModel):
    id: str
    name: str
    size: int
    mime_type: str
    status: DocumentStatus
    progress: int | None = None
    uploaded_at: str
    error_message: str | None = None


class ChatRequest(BaseModel):
    prompt: str


class Citation(CamelModel):
    id: str
    document_id: str
    document_name: str
    page: int | None = None
    snippet: str
    confidence: float | None = None


class ChatMessage(CamelModel):
    id: str
    role: Literal["assistant"]
    content: str
    created_at: str
    citations: list[Citation]
    confidence: float | None = None
    related_asset_ids: list[str]


class Asset(CamelModel):
    id: str
    name: str
    type: str
    location: str | None = None
    document_count: int
    status: Literal["operational", "warning", "critical", "unknown"] | None = None
    tags: list[str] | None = None


class RelatedDocument(CamelModel):
    id: str
    name: str
    type: str


class RelatedChunk(CamelModel):
    id: str
    document_id: str
    document_name: str
    page: int | None = None
    text: str


class AssetDetails(Asset):
    description: str | None = None
    related_documents: list[RelatedDocument]
    related_chunks: list[RelatedChunk]


class DashboardMetrics(CamelModel):
    documents_indexed: int
    ai_queries_run: int
    assets_detected: int
