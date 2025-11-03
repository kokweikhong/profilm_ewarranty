import apiClient from "@/lib/api/client";
import { ProductName } from "@/types/productName";

export class ProductNameService {
  private static readonly BASE_PATH = "/products/names";

  public static async getAll(): Promise<ProductName[]> {
    const response = await apiClient.get<ProductName[]>(this.BASE_PATH);
    return response.data;
  }

  public static async getById(id: string): Promise<ProductName | null> {
    const response = await apiClient.get<ProductName>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data || null;
  }

  public static async getBySeriesId(seriesId: string): Promise<ProductName[]> {
    const response = await apiClient.get<ProductName[]>(
      `${this.BASE_PATH}/by-series/${seriesId}`
    );
    return response.data;
  }

  public static async update(
    id: string,
    data: ProductName
  ): Promise<ProductName | null> {
    const response = await apiClient.put<ProductName>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data || null;
  }

  public static async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }
}
