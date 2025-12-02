"use server";

import axios from "axios";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/productsType";
import { getApiBaseUrl } from "@/lib/env";

export async function createProductAction(payload: CreateProductRequest) {
  console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(`${getApiBaseUrl()}/products`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
    const response = await axios.put(
      `${getApiBaseUrl()}/products/${payload.id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
