import type { Asset, AssetDetails } from "@/types";
import { MOCK_MODE, apiFetch, delay } from "./api";
import { mockAssetDetails, mockAssets } from "./mock-data";

export async function listAssets(): Promise<Asset[]> {
  if (MOCK_MODE) {
    await delay(350);
    return mockAssets;
  }
  return apiFetch<Asset[]>("/assets");
}

export async function getAsset(id: string): Promise<AssetDetails> {
  if (MOCK_MODE) {
    await delay(400);
    const a = mockAssetDetails[id];
    if (!a) throw new Error("Asset not found");
    return a;
  }
  return apiFetch<AssetDetails>(`/assets/${id}`);
}