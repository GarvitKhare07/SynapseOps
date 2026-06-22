from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.router import api_router
from backend.config import get_settings
from backend.database.chroma import init_chroma
from backend.database.mongo import close_mongo, connect_mongo


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_chroma()
    await connect_mongo()
    yield
    await close_mongo()


settings = get_settings()
app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)
