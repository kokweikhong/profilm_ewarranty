import apiClient, { getServerApiClient } from "@/lib/axios";
import { MsiaState, ShopListResponse, Shop } from "@/types/shopsType";

export async function getMsiaStatesApi(): Promise<MsiaState[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<MsiaState[]>("/shops/states");
  return response.data;
}

export async function getShopsViewApi(): Promise<ShopListResponse[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ShopListResponse[]>("/shops");
  return response.data;
}

export async function getShops(): Promise<Shop[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Shop[]>("/shops");
  return response.data;
}

export async function getShopByIdApi(id: number): Promise<Shop> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Shop>(`/shops/${id}`);
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
