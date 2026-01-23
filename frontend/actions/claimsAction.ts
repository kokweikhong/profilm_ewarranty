"use client";

import apiClient from "@/lib/axios";
import {
  CreateClaimWithPartsRequest,
  UpdateClaimWithPartsRequest,
} from "@/types/claimsType";

// Action to create a new claim along with its associated warranty parts.
export async function createClaimAction(data: CreateClaimWithPartsRequest) {
  try {
    const response = await apiClient.post("/claims", data);
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

export async function updateClaimAction(data: UpdateClaimWithPartsRequest) {
  try {
    const response = await apiClient.put(`/claims/${data.claim.id}`, data);
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

export async function updateClaimApprovalAction(
  claimId: number,
  approvalStatus: string,
) {
  try {
    const response = await apiClient.put(`/claims/${claimId}/approval`, {
      approvalStatus,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating claim approval:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update claim approval",
    };
  }
}

export async function updateClaimWarrantyPartApprovalAction(
  partId: number,
  approvalStatus: string,
) {
  try {
    const response = await apiClient.put(
      `/claims/claim-warranty-parts/${partId}/approval`,
      { approvalStatus },
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating claim warranty part approval:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to update claim warranty part approval",
    };
  }
}

export async function updateClaimStatusAction(
  claimId: number,
  isOpen: boolean,
) {
  try {
    const response = await apiClient.put(`/claims/${claimId}/status`, {
      isOpen,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating claim status:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update claim status",
    };
  }
}

export async function updateClaimWarrantyPartStatusAction(
  partId: number,
  isOpen: boolean,
) {
  try {
    const response = await apiClient.put(
      `/claims/claim-warranty-parts/${partId}/status`,
      { isOpen },
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Error updating claim warranty part status:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to update claim warranty part status",
    };
  }
}
