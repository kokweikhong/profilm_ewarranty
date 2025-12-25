import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";
import {
  ProductAllocationsListResponse,
  ProductAllocation,
  ProductsFromAllocationByShopIdResponse,
} from "@/types/productAllocationsType";

export async function getProductAllocationsApi(): Promise<
  ProductAllocationsListResponse[]
> {
  const response = await axios.get<ProductAllocationsListResponse[]>(
    `${getApiBaseUrl()}/product-allocations`
  );
  return response.data;
}

export async function getProductAllocationByIdApi(
  id: number
): Promise<ProductAllocation> {
  const response = await axios.get<ProductAllocation>(
    `${getApiBaseUrl()}/product-allocations/${id}`
  );
  return response.data;
}

export async function getProductsFromAllocationByShopIdApi(
  shopId: number
): Promise<ProductsFromAllocationByShopIdResponse[]> {
  const response = await axios.get<ProductsFromAllocationByShopIdResponse[]>(
    `${getApiBaseUrl()}/product-allocations/products-by-shop/${shopId}`
  );
  return response.data;
}
