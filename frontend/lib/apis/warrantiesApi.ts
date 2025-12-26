import apiClient from "@/lib/axios";
import { WarrantyView, Warranty, CarPart } from "@/types/warrantiesType";
import { WarrantySearchResult, WarrantyPart } from "@/types/claimsType";

export async function getWarrantiesApi(): Promise<WarrantyView[]> {
  const response = await apiClient.get<WarrantyView[]>("/warranties");
  return response.data;
}

export async function getWarrantyByIdApi(id: number): Promise<Warranty> {
  const response = await apiClient.get<Warranty>(`/warranties/${id}`);
  return response.data;
}

export async function getWarrantyPartsApi(
  warrantyId: number
): Promise<WarrantyPart[]> {
  const response = await apiClient.get<WarrantyPart[]>(
    `/warranties/${warrantyId}/parts`
  );
  return response.data;
}

export async function searchWarrantiesApi(
  query: string
): Promise<WarrantySearchResult[]> {
  const response = await apiClient.get<WarrantySearchResult[]>(
    `/warranties/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
}

export async function getCarPartsApi(): Promise<CarPart[]> {
  const response = await apiClient.get<CarPart[]>("/warranties/car-parts");
  return response.data;
}
