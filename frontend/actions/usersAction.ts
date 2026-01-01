"use client";

import apiClient from "@/lib/axios";

export async function updatePasswordAction(
  userId: number,
  newPassword: string
) {
  try {
    await apiClient.put(`/users/${userId}/password`, {
      newPassword,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating password:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update password",
    };
  }
}
