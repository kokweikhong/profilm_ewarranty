import apiClient, { getServerApiClient } from "@/lib/axios";
import { Warranty, CarPart, WarrantyDetails } from "@/types/warrantiesType";
import { WarrantySearchResult, WarrantyPart } from "@/types/claimsType";

export async function getWarrantiesApi(): Promise<WarrantyDetails[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantyDetails[]>("/warranties");
  return response.data;
}

export async function getWarrantyByIdApi(id: number): Promise<Warranty> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Warranty>(`/warranties/${id}`);
  return response.data;
}

export async function getWarrantyPartsApi(
  warrantyId: number
): Promise<WarrantyPart[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantyPart[]>(
    `/warranties/${warrantyId}/parts`
  );
  return response.data;
}

export async function searchWarrantiesApi(
  query: string
): Promise<WarrantySearchResult[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<WarrantySearchResult[]>(
    `/warranties/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
}

export async function getCarPartsApi(): Promise<CarPart[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<CarPart[]>("/warranties/car-parts");
  return response.data;
}
