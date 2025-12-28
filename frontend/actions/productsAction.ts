"use server";

import axios from "axios";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/productsType";
import { getServerApiClient } from "@/lib/axios";

export async function createProductAction(payload: CreateProductRequest) {
  console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));

  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.post("/products", payload);
    console.log("Backend response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating product:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateProductAction(payload: UpdateProductRequest) {
  console.log(
    "Sending update payload to backend:",
    JSON.stringify(payload, null, 2)
  );
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.put(`/products/${payload.id}`, payload);
    console.log("Backend update response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating product:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
