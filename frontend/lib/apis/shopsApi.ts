import apiClient from "@/lib/axios";
import { MsiaState, ShopListResponse, Shop } from "@/types/shopsType";

export async function getMsiaStatesApi(): Promise<MsiaState[]> {
  const response = await apiClient.get<MsiaState[]>("/shops/states");
  return response.data;
}

export async function getShopsViewApi(): Promise<ShopListResponse[]> {
  const response = await apiClient.get<ShopListResponse[]>("/shops");
  return response.data;
}

export async function getShops(): Promise<Shop[]> {
  const response = await apiClient.get<Shop[]>("/shops");
  return response.data;
}

export async function getShopByIdApi(id: number): Promise<Shop> {
  const response = await apiClient.get<Shop>(`/shops/${id}`);
  return response.data;
}

export async function generateNextBranchCodeApi(
  stateCode: string
): Promise<string> {
  const response = await apiClient.get<{ branch_code: string }>(
    `/shops/generate-branch-code/${stateCode}`
  );
  return response.data.branch_code;
}
