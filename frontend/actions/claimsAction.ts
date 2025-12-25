"use server";

import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";
import { CreateClaimRequest, UpdateClaimRequest } from "@/types/claimsType";

export async function createClaimAction(data: CreateClaimRequest) {
  try {
    const response = await axios.post(`${getApiBaseUrl()}/claims`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating claim:", error);
    return { success: false, error: "Failed to create claim" };
  }
}

export async function updateClaimAction(data: UpdateClaimRequest) {
  try {
    const response = await axios.put(
      `${getApiBaseUrl()}/claims/${data.id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating claim:", error);
    return { success: false, error: "Failed to update claim" };
  }
}
