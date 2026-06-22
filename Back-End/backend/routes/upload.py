from fastapi import APIRouter, BackgroundTasks, File, UploadFile

from backend.models.schemas import PlantDocument
from backend.services.document_service import document_service


router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=PlantDocument, response_model_by_alias=True)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
) -> PlantDocument:
    document = await document_service.create_upload(file)
    background_tasks.add_task(document_service.process_document, document.id)
    return document
