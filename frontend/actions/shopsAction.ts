"use client";

import apiClient from "@/lib/axios";
import { CreateShopRequest, UpdateShopRequest } from "@/types/shopsType";

export async function createShopAction(payload: CreateShopRequest) {
  console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));
  try {
    const response = await apiClient.post(`/shops`, payload);
    console.log("Backend response:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
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
}

export async function updateShopAction(payload: UpdateShopRequest) {
  console.log("Sending payload to backend:", JSON.stringify(payload, null, 2));
  try {
    const response = await apiClient.put(`/shops/${payload.id}`, payload);
    console.log("Backend response:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
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
}
