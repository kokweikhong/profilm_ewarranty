"use server";

import axios from "axios";
import {
  CreateWarrantyRequest,
  UpdateWarrantyRequest,
  CreateWarrantyWithPartsRequest,
} from "@/types/warrantiesType";
import { getServerApiClient } from "@/lib/axios";

export async function createWarrantyAction(
  data: CreateWarrantyWithPartsRequest
) {
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.post("/warranties", data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating warranty:", {
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
    return { success: false, error: "Failed to create warranty" };
  }
}

export async function updateWarrantyAction(data: UpdateWarrantyRequest) {
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.put(`/warranties/${data.id}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating warranty:", {
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
    return { success: false, error: "Failed to update warranty" };
  }
}

export async function updateWarrantyApprovalAction(
  id: number,
  isApproved: boolean
) {
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.put(`/warranties/${id}/approval`, {
      isApproved,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating warranty part approval:", {
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
    return { success: false, error: "Failed to update warranty part approval" };
  }
}

// WarrantyID int32 `db:"warranty_id" json:"warrantyId"`
//     IsApproved bool  `db:"is_approved" json:"isApproved"`
//     CarPartID  int32 `db:"car_part_id" json:"carPartId"

export async function updateWarrantyPartApprovalAction(
  warrantyPartId: number,
  isApproved: boolean
) {
  try {
    const apiClient = await getServerApiClient();
    const response = await apiClient.put(
      `/warranties/warranty-parts/${warrantyPartId}/approval`,
      {
        isApproved,
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error updating warranty part approval:", {
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
    return { success: false, error: "Failed to update warranty part approval" };
  }
}
