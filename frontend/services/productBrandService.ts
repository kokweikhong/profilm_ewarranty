import apiClient from "@/lib/api/client";
import { ProductBrand } from "@/types/productBrand";
import { ProductBrandCreateRequest } from "@/types/productBrand";

export class ProductBrandService {
  private static readonly BASE_PATH = "/products/brands";

  public static async getAll(): Promise<ProductBrand[]> {
    const response = await apiClient.get<ProductBrand[]>(this.BASE_PATH);
    return response.data;
  }

  public static async getById(id: string): Promise<ProductBrand | null> {
    const response = await apiClient.get<ProductBrand>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  public static async create(
    data: ProductBrandCreateRequest
  ): Promise<ProductBrand> {
    const response = await apiClient.post<ProductBrand>(this.BASE_PATH, data);
    return response.data;
  }

  // public static async update(id: string, data: ProductBrandCreateRequest): Promise<ProductBrand | null> {
  //     const response = await apiClient.put<ProductBrand>(`${this.BASE_PATH}/${id}`, data);
  //     return response.data;
  // }

  // public static async delete(id: string): Promise<void> {
  //     await apiClient.delete(`${this.BASE_PATH}/${id}`);
  // }
}
