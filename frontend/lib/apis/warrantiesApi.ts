import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";
import { WarrantyView, Warranty, CarPart } from "@/types/warrantiesType";
import { WarrantySearchResult, WarrantyPart } from "@/types/claimsType";

export async function getWarrantiesApi(): Promise<WarrantyView[]> {
  const response = await axios.get<WarrantyView[]>(
    `${getApiBaseUrl()}/warranties`
  );
  return response.data;
}

export async function getWarrantyByIdApi(id: number): Promise<Warranty> {
  const response = await axios.get<Warranty>(
    `${getApiBaseUrl()}/warranties/${id}`
  );
  return response.data;
}

export async function getWarrantyPartsApi(
  warrantyId: number
): Promise<WarrantyPart[]> {
  const response = await axios.get<WarrantyPart[]>(
    `${getApiBaseUrl()}/warranties/${warrantyId}/parts`
  );
  return response.data;
}

export async function searchWarrantiesApi(
  query: string
): Promise<WarrantySearchResult[]> {
  const response = await axios.get<WarrantySearchResult[]>(
    `${getApiBaseUrl()}/warranties/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
}

export async function getCarPartsApi(): Promise<CarPart[]> {
  const response = await axios.get<CarPart[]>(
    `${getApiBaseUrl()}/warranties/car-parts`
  );
  return response.data;
}
