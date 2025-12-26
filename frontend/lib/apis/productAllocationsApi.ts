import apiClient from "@/lib/axios";
import {
  ProductAllocationsListResponse,
  ProductAllocation,
  ProductsFromAllocationByShopIdResponse,
} from "@/types/productAllocationsType";

export async function getProductAllocationsApi(): Promise<
  ProductAllocationsListResponse[]
> {
  const response = await apiClient.get<ProductAllocationsListResponse[]>(
    "/product-allocations"
  );
  return response.data;
}

export async function getProductAllocationByIdApi(
  id: number
): Promise<ProductAllocation> {
  const response = await apiClient.get<ProductAllocation>(
    `/product-allocations/${id}`
  );
  return response.data;
}

export async function getProductsFromAllocationByShopIdApi(
  shopId: number
): Promise<ProductsFromAllocationByShopIdResponse[]> {
  const response = await apiClient.get<
    ProductsFromAllocationByShopIdResponse[]
  >(`/product-allocations/products-by-shop/${shopId}`);
  return response.data;
}
