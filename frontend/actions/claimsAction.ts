"use client";

import apiClient from "@/lib/axios";
import { CreateClaimRequest, UpdateClaimRequest } from "@/types/claimsType";

export async function createClaimAction(data: CreateClaimRequest) {
  try {
    const response = await apiClient.post(`/claims`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error creating claim:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create claim",
    };
  }
}

export async function updateClaimAction(data: UpdateClaimRequest) {
  try {
    const response = await apiClient.put(`/claims/${data.id}`, data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating claim:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update claim",
    };
  }
}
