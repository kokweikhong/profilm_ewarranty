"use client";

import apiClient from "@/lib/axios";
import {
  CreateWarrantyRequest,
  UpdateWarrantyRequest,
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
} from "@/types/warrantiesType";

export async function createWarrantyWithPartsAction(
  data: CreateWarrantyWithPartsRequest
) {
  try {
    const response = await apiClient.post("/warranties", data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error creating warranty:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create warranty",
    };
  }
}

export async function updateWarrantyAction(
  data: UpdateWarrantyWithPartsRequest
) {
  try {
    const response = await apiClient.put(
      `/warranties/${data.warranty.id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating warranty:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update warranty",
    };
  }
}

export async function updateWarrantyApprovalAction(
  id: number,
  isApproved: boolean
) {
  try {
    const response = await apiClient.put(`/warranties/${id}/approval`, {
      isApproved,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating warranty approval:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update warranty approval",
    };
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
    const response = await apiClient.put(
      `/warranties/warranty-parts/${warrantyPartId}/approval`,
      {
        isApproved,
      }
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating warranty part approval:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to update warranty part approval",
    };
  }
}
