import apiClient from "@/lib/axios";
import { Claim } from "@/types/claimsType";

export async function getClaimsApi(): Promise<Claim[]> {
  const response = await apiClient.get<Claim[]>("/claims");
  return response.data;
}

export async function getClaimByIdApi(id: number): Promise<Claim> {
  const response = await apiClient.get<Claim>(`/claims/${id}`);
  return response.data;
}
