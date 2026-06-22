from fastapi import APIRouter

from backend.models.schemas import DashboardMetrics
from backend.services.metrics_service import metrics_service


router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardMetrics, response_model_by_alias=True)
async def dashboard() -> DashboardMetrics:
    return await metrics_service.get_dashboard()
