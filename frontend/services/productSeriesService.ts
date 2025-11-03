import apiClient from "@/lib/api/client";
import { ProductSeries } from "@/types/productSeries";

export class ProductSeriesService {
  private static readonly BASE_PATH = "/products/series";

  static async getAll(): Promise<ProductSeries[]> {
    const response = await apiClient.get<ProductSeries[]>(this.BASE_PATH);
    return response.data;
  }

  static async getById(id: string): Promise<ProductSeries | null> {
    const response = await apiClient.get<ProductSeries>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  static async getByProductTypeId(
    productTypeId: string
  ): Promise<ProductSeries[]> {
    const response = await apiClient.get<ProductSeries[]>(
      `${this.BASE_PATH}/by-type/${productTypeId}`
    );
    return response.data;
  }

  static async update(
    id: string,
    data: Partial<ProductSeries>
  ): Promise<ProductSeries | null> {
    const response = await apiClient.put<ProductSeries>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<boolean> {
    const response = await apiClient.delete(`${this.BASE_PATH}/${id}`);
    return response.status === 204;
  }
}
