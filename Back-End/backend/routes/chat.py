from fastapi import APIRouter

from backend.models.schemas import ChatMessage, ChatRequest
from backend.services.rag_service import rag_service


router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatMessage, response_model_by_alias=True)
async def chat(request: ChatRequest) -> ChatMessage:
    return await rag_service.answer(request.prompt)
