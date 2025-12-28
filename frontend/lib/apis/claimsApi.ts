import apiClient, { getServerApiClient } from "@/lib/axios";
import { Claim } from "@/types/claimsType";

export async function getClaimsApi(): Promise<Claim[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Claim[]>("/claims");
  return response.data;
}

export async function getClaimByIdApi(id: number): Promise<Claim> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Claim>(`/claims/${id}`);
  return response.data;
}

export async function getClaimsByShopIdApi(shopId: number): Promise<Claim[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Claim[]>(`/claims/by-shop/${shopId}`);
  return response.data;
}
