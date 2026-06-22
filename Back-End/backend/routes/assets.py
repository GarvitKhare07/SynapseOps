from fastapi import APIRouter, HTTPException, status

from backend.models.schemas import Asset, AssetDetails
from backend.services.asset_service import asset_service


router = APIRouter(tags=["assets"])


@router.get("/assets", response_model=list[Asset], response_model_by_alias=True)
async def list_assets() -> list[Asset]:
    return await asset_service.list_assets()


@router.get("/assets/{id}", response_model=AssetDetails, response_model_by_alias=True)
async def get_asset(id: str) -> AssetDetails:
    asset = await asset_service.get_asset_details(id)
    if asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    return asset
