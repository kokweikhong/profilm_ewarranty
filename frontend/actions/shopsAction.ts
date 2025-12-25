"use server";

import axios from "axios";
import { CreateShopRequest, UpdateShopRequest } from "@/types/shopsType";
import { getApiBaseUrl } from "@/lib/env";

export async function createShopAction(payload: CreateShopRequest) {
  console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));
  try {
    const response = await axios.post(`${getApiBaseUrl()}/shops`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Backend response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating shop:", {
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

export async function updateShopAction(payload: UpdateShopRequest) {
  console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));
  try {
    const response = await axios.put(
      `${getApiBaseUrl()}/shops/${payload.id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Backend response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating shop:", {
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
