import apiClient, { getServerApiClient } from "@/lib/axios";
import {
  ProductBrand,
  ProductType,
  ProductSeries,
  ProductName,
  Product,
  ProductDetailResponse,
} from "@/types/productsType";

export async function getProductsApi(): Promise<ProductDetailResponse[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get("/products");
  return response.data;
}

export async function getProductByIdApi(productId: number): Promise<Product> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<Product>(`/products/${productId}`);
  return response.data;
}

export async function getProductBrandsApi(): Promise<ProductBrand[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ProductBrand[]>("/products/brands");
  return response.data;
}

export async function getProductTypesApi(): Promise<ProductType[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ProductType[]>("/products/types");
  return response.data;
}

export async function getProductSeriesApi(): Promise<ProductSeries[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ProductSeries[]>("/products/series");
  return response.data;
}

export async function getProductNamesApi(): Promise<ProductName[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ProductName[]>("/products/names");
  return response.data;
}
