from backend.database.mongo import get_db
from backend.models.schemas import DashboardMetrics


class MetricsService:
    async def increment_ai_queries(self) -> None:
        await get_db().metrics.update_one(
            {"_id": "dashboard"},
            {"$inc": {"aiQueriesRun": 1}},
            upsert=True,
        )

    async def get_dashboard(self) -> DashboardMetrics:
        db = get_db()
        documents_indexed = await db.documents.count_documents({"status": "Indexed"})
        assets_detected = await db.assets.count_documents({})
        metrics = await db.metrics.find_one({"_id": "dashboard"}) or {}
        return DashboardMetrics(
            documents_indexed=documents_indexed,
            ai_queries_run=metrics.get("aiQueriesRun", 0),
            assets_detected=assets_detected,
        )


metrics_service = MetricsService()
