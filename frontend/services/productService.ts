import apiClient from "@/lib/api/client";
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductsResponse,
  ApiResponse,
  ProductDetails,
} from "@/types/product";

export class ProductService {
  private static readonly BASE_PATH = "/products";

  // Get all products with pagination
  static async getProducts(params?: {}): Promise<Product[]> {
    try {
      const response = await apiClient.get<Product[]>(
        this.BASE_PATH + "/details", // matches your working URL
        { params }
      );
      console.log("Fetched products:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // Alternative method that returns converted ProductsResponse format
  static async getProductsConverted(params?: {
    // page?: number;
    // limit?: number;
  }): Promise<ProductsResponse> {
    try {
      const response = await apiClient.get<Product[]>(
        this.BASE_PATH + "/details",
        { params }
      );

      return { products: response.data };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
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

  // Detailed product info
  static async getProductsDetails(): Promise<ProductDetails[]> {
    const response = await apiClient.get<ApiResponse<ProductDetails[]>>(
      `${this.BASE_PATH}/details`
    );
    return response.data.data;
  }
}
