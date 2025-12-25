import axios from "axios";
import { MsiaState, ShopListResponse, Shop } from "@/types/shopsType";
import { getApiBaseUrl } from "@/lib/env";

export async function getMsiaStatesApi(): Promise<MsiaState[]> {
  const response = await axios.get<MsiaState[]>(
    `${getApiBaseUrl()}/shops/states`
  );
  return response.data;
}

export async function getShopsViewApi(): Promise<ShopListResponse[]> {
  const response = await axios.get<ShopListResponse[]>(
    `${getApiBaseUrl()}/shops`
  );
  return response.data;
}

export async function getShops(): Promise<Shop[]> {
  const response = await axios.get<Shop[]>(`${getApiBaseUrl()}/shops`);
  return response.data;
}

export async function getShopByIdApi(id: number): Promise<Shop> {
  const response = await axios.get<Shop>(`${getApiBaseUrl()}/shops/${id}`);
  return response.data;
}

export async function generateNextBranchCodeApi(
  stateCode: string
): Promise<string> {
  const response = await axios.get<{ branch_code: string }>(
    `${getApiBaseUrl()}/shops/generate-branch-code/${stateCode}`
  );
  return response.data.branch_code;
}
