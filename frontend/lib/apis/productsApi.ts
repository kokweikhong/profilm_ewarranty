import axios from "axios";
import {
  ProductBrand,
  ProductType,
  ProductSeries,
  ProductName,
  Product,
} from "@/types/productsType";
import { getApiBaseUrl } from "@/lib/env";

export async function getProductsApi() {
  const response = await fetch(`${getApiBaseUrl()}/products`, {
    cache: "no-store",
  });
  return response.json();
}

export async function getProductByIdApi(productId: number): Promise<Product> {
  const response = await fetch(`${getApiBaseUrl()}/products/${productId}`, {
    cache: "no-store",
  });
  return response.json();
}

export async function getProductBrandsApi(): Promise<ProductBrand[]> {
  const response = await axios.get<ProductBrand[]>(
    `${getApiBaseUrl()}/products/brands`
  );
  return response.data;
}

export async function getProductTypesApi(): Promise<ProductType[]> {
  const response = await axios.get<ProductType[]>(
    `${getApiBaseUrl()}/products/types`
  );
  return response.data;
}

export async function getProductSeriesApi(): Promise<ProductSeries[]> {
  const response = await axios.get<ProductSeries[]>(
    `${getApiBaseUrl()}/products/series`
  );
  return response.data;
}

export async function getProductNamesApi(): Promise<ProductName[]> {
  const response = await axios.get<ProductName[]>(
    `${getApiBaseUrl()}/products/names`
  );
  return response.data;
}
