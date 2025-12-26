import apiClient from "@/lib/axios";
import {
  ProductBrand,
  ProductType,
  ProductSeries,
  ProductName,
  Product,
} from "@/types/productsType";

export async function getProductsApi(): Promise<Product[]> {
  const response = await apiClient.get("/products");
  return response.data;
}

export async function getProductByIdApi(productId: number): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${productId}`);
  return response.data;
}

export async function getProductBrandsApi(): Promise<ProductBrand[]> {
  const response = await apiClient.get<ProductBrand[]>("/products/brands");
  return response.data;
}

export async function getProductTypesApi(): Promise<ProductType[]> {
  const response = await apiClient.get<ProductType[]>("/products/types");
  return response.data;
}

export async function getProductSeriesApi(): Promise<ProductSeries[]> {
  const response = await apiClient.get<ProductSeries[]>("/products/series");
  return response.data;
}

export async function getProductNamesApi(): Promise<ProductName[]> {
  const response = await apiClient.get<ProductName[]>("/products/names");
  return response.data;
}
