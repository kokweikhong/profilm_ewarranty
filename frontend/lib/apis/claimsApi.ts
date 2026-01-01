import apiClient, { getServerApiClient } from "@/lib/axios";
import { Claim, ListClaimsResponse } from "@/types/claimsType";

export async function getClaimsApi(): Promise<ListClaimsResponse[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ListClaimsResponse[]>("/claims");
  return response.data;
}

export async function getClaimByIdApi(id: number): Promise<Claim> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Claim>(`/claims/${id}`);
  return response.data;
}

export async function getClaimsByShopIdApi(
  shopId: number
): Promise<ListClaimsResponse[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ListClaimsResponse[]>(
    `/claims/by-shop/${shopId}`
  );
  return response.data;
}

export async function generateNextClaimNoApi(
  warrantyNo: string,
  claimDate: string
): Promise<{ claimNo: string }> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.post<{ claimNo: string }>(
    `/claims/generate-claim-no`,
    { warrantyNo, claimDate }
  );
  return response.data;
}
