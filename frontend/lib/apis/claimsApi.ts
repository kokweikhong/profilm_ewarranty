import apiClient, { getServerApiClient } from "@/lib/axios";
import {
  ClaimView,
  Claim,
  ListClaimsResponse,
  ClaimWithPartsDetailResponse,
} from "@/types/claimsType";

export async function getClaimsApi(): Promise<ClaimView[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ClaimView[]>("/claims");
  return response.data;
}

export async function getClaimByIdApi(id: number): Promise<ClaimView> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ClaimView>(`/claims/${id}`);
  return response.data;
}

export async function getClaimWarrantyPartsByClaimIdApi(claimId: number) {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get(`/claims/claim-warranty-parts/${claimId}`);
  return response.data;
}

export async function getClaimWithPartsByIdApi(
  id: number
): Promise<ClaimWithPartsDetailResponse> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;

  // Fetch claim and parts separately
  const claim = await client.get(`/claims/${id}/details`);

  return claim.data;
}

export async function getClaimsByShopIdApi(
  shopId: number
): Promise<ClaimView[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ClaimView[]>(`/claims/by-shop/${shopId}`);
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
