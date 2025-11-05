import apiClient from "@/lib/api/client";
import { WarrantyYear } from "@/types/warrantyYear";

export class WarrantyYearService {
  private static readonly BASE_PATH = "/products/warranty-years";
  public static async getAll(): Promise<WarrantyYear[]> {
    const response = await apiClient.get<WarrantyYear[]>(this.BASE_PATH);
    return response.data;
  }
}
