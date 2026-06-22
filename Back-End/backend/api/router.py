from fastapi import APIRouter

from backend.routes import assets, chat, dashboard, documents, upload


api_router = APIRouter()
api_router.include_router(upload.router)
api_router.include_router(documents.router)
api_router.include_router(chat.router)
api_router.include_router(assets.router)
api_router.include_router(dashboard.router)
