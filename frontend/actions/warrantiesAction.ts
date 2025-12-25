"use server";

import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";
import {
  CreateWarrantyRequest,
  UpdateWarrantyRequest,
} from "@/types/warrantiesType";

export async function createWarrantyAction(data: CreateWarrantyRequest) {
  try {
    const response = await axios.post(`${getApiBaseUrl()}/warranties`, data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error creating warranty:", error);
    return { success: false, error: "Failed to create warranty" };
  }
}

export async function updateWarrantyAction(data: UpdateWarrantyRequest) {
  try {
    const response = await axios.put(
      `${getApiBaseUrl()}/warranties/${data.id}`,
      data
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating warranty:", error);
    return { success: false, error: "Failed to update warranty" };
  }
}
