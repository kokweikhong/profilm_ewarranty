import apiClient, { getServerApiClient } from "@/lib/axios";
import {
  ProductAllocationsListResponse,
  ProductAllocation,
  ProductsFromAllocationByShopIdResponse,
} from "@/types/productAllocationsType";

export async function getProductAllocationsApi(): Promise<
  ProductAllocationsListResponse[]
> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ProductAllocationsListResponse[]>(
    "/product-allocations"
  );
  return response.data;
}

export async function getProductAllocationByIdApi(
  id: number
): Promise<ProductAllocation> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ProductAllocation>(
    `/product-allocations/${id}`
  );
  return response.data;
}

export async function getProductsFromAllocationByShopIdApi(
  shopId: number
): Promise<ProductsFromAllocationByShopIdResponse[]> {
  const client =
    typeof window === "undefined" ? await getServerApiClient() : apiClient;
  const response = await client.get<ProductsFromAllocationByShopIdResponse[]>(
    `/product-allocations/products-by-shop/${shopId}`
  );
  return response.data;
}
