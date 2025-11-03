import apiClient from "@/lib/api/client";
import { ProductType } from "@/types/productType";

export class ProductTypeService {
  private static readonly BASE_PATH = "/products/types";

  public static async getAll(): Promise<ProductType[]> {
    const response = await apiClient.get<ProductType[]>(this.BASE_PATH);
    return response.data;
  }

  public static async getById(id: string): Promise<ProductType | null> {
    const response = await apiClient.get<ProductType>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  public static async getByBrandId(brandId: string): Promise<ProductType[]> {
    const response = await apiClient.get<ProductType[]>(
      `${this.BASE_PATH}/by-brand/${brandId}`
    );
    return response.data;
  }

  //   public static async create(data: ProductTypeCreateRequest): Promise<ProductType> {
  //     const response = await apiClient.post<ProductType>(this.BASE_PATH, data);
  //     return response.data;
  //   }

  //   public static async update(id: string, data: ProductTypeCreateRequest): Promise<ProductType | null> {
  //     const response = await apiClient.put<ProductType>(`${this.BASE_PATH}/${id}`, data);
  //     return response.data;
  //   }

  //   public static async delete(id: string): Promise<void> {
  //     await apiClient.delete(`${this.BASE_PATH}/${id}`);
  //   }
}
