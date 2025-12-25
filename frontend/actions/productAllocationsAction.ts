"use server";

import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";
import {
  CreateProductAllocationRequest,
  UpdateProductAllocationRequest,
} from "@/types/productAllocationsType";

export async function createProductAllocationAction(
  data: CreateProductAllocationRequest
) {
  try {
    const response = await axios.post(
      `${getApiBaseUrl()}/product-allocations`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating product allocation:", error);
    return { success: false, error: "Failed to create product allocation" };
  }
}

export async function updateProductAllocationAction(
  data: UpdateProductAllocationRequest
) {
  try {
    const response = await axios.put(
      `${getApiBaseUrl()}/product-allocations/${data.id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating product allocation:", error);
    return { success: false, error: "Failed to update product allocation" };
  }
}
