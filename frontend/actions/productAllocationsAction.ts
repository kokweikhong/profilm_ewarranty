"use client";

import apiClient from "@/lib/axios";
import {
  CreateProductAllocationRequest,
  UpdateProductAllocationRequest,
} from "@/types/productAllocationsType";

export async function createProductAllocationAction(
  data: CreateProductAllocationRequest
) {
  try {
    const response = await apiClient.post("/product-allocations", data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error creating product allocation:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to create product allocation",
    };
  }
}

export async function updateProductAllocationAction(
  data: UpdateProductAllocationRequest
) {
  try {
    const response = await apiClient.put(
      `/product-allocations/${data.id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating product allocation:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update product allocation",
    };
  }
}
