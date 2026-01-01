import apiClient, { getServerApiClient } from "@/lib/axios";
import {
  Warranty,
  CarPart,
  WarrantyDetails,
  WarrantyWithPartsResponse,
  WarrantySearchResult,
} from "@/types/warrantiesType";

export async function getWarrantiesApi(): Promise<WarrantyDetails[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantyDetails[]>("/warranties");
  return response.data;
}

export async function getWarrantiesWithPartsByIdApi(
  id: number
): Promise<WarrantyWithPartsResponse> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantyWithPartsResponse>(
    `/warranties/${id}/details`
  );
  return response.data;
}

export async function getWarrantyByIdApi(id: number): Promise<Warranty> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Warranty>(`/warranties/${id}`);
  return response.data;
}

export async function getCarPartsApi(): Promise<CarPart[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<CarPart[]>("/warranties/car-parts");
  return response.data;
}

export async function getWarrantyWithPartsByIdApi(
  id: number
): Promise<WarrantyWithPartsResponse> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantyWithPartsResponse>(
    `/warranties/${id}`
  );
  return response.data;
}

export async function generateNextWarrantyNoApi(
  branchCode: string,
  installationDate: string
): Promise<{ warrantyNo: string }> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<{ warrantyNo: string }>(
    `/warranties/generate-warranty-no/${branchCode}-${installationDate}`
  );
  return response.data;
}

export async function getWarrantiesByExactSearchApi(
  searchTerm: string
): Promise<WarrantySearchResult[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantySearchResult[]>(
    `/warranties/search/${encodeURIComponent(searchTerm)}`
  );
  return response.data;
}

export async function getWarrantiesWithPartsByShopIdApi(
  shopId: number
): Promise<WarrantyWithPartsResponse[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantyWithPartsResponse[]>(
    `/warranties/by-shop/${shopId}`
  );
  return response.data;
}
