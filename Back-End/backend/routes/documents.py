from fastapi import APIRouter

from backend.models.schemas import PlantDocument
from backend.services.document_service import document_service


router = APIRouter(tags=["documents"])


@router.get("/documents", response_model=list[PlantDocument], response_model_by_alias=True)
async def list_documents() -> list[PlantDocument]:
    return await document_service.list_documents()
