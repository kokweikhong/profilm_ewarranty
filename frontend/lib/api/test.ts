import apiClient from "@/lib/api/client";
import { VwProductDetail } from "@/types/product";

// Simple test function to verify API connection
export const testProductAPI = async () => {
  try {
    console.log("Testing API connection...");
    const response = await apiClient.get<VwProductDetail[]>(
      "/products/detials"
    );
    console.log("API Test Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Test Failed:", error);
    throw error;
  }
};

// Alternative direct axios test (for debugging)
export const testDirectAPI = async () => {
  try {
    const axios = (await import("axios")).default;
    const response = await axios.get<VwProductDetail[]>(
      "http://localhost:8080/api/v1/products/detials"
    );
    console.log("Direct API Test Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Direct API Test Failed:", error);
    throw error;
  }
};
