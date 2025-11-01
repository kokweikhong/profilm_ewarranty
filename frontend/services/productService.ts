import apiClient from "@/lib/api/client";
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductListResponse,
  VwProductDetail,
  VwProductListResponse,
  ApiResponse,
  convertVwProductToProductDetail,
  convertVwProductListToProducts,
} from "@/types/product";

export class ProductService {
  private static readonly BASE_PATH = "/products";

  // Get all products with pagination
  static async getProducts(params?: {
    // page?: number;
    // limit?: number;
    // category?: string;
    // brand?: string;
    // status?: string;
  }): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<VwProductListResponse>>(
      this.BASE_PATH,
      { params }
    );
    if (response.data && response.data.data) {
      return convertVwProductListToProducts(response.data.data.products);
    }
    return [];
  }

  // Get single product by ID
  static async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data.data;
  }

  // Create new product
  static async createProduct(product: ProductCreateRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(
      this.BASE_PATH,
      product
    );
    return response.data.data;
  }

  // Update existing product
  static async updateProduct(product: ProductUpdateRequest): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(
      `${this.BASE_PATH}/${product.id}`,
      product
    );
    return response.data.data;
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      `${this.BASE_PATH}/search`,
      { params: { q: query } }
    );
    return response.data.data;
  }
}
