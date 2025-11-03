export interface Product {
  id: string;
  name: string;
  series: string;
  type: string;
  brand: string;
  warrantyYears: number;
  filmSerialNo: string;
  filmQuantity: number;
  filmShipmentNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetails {
  productId: string;
  productName: string;
  productSeries: string;
  productType: string;
  productBrand: string;
  warrantyYears: number;
  filmSerialNo: string;
  filmQuantity: number;
  filmShipmentNo: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  model: string;
  warrantyPeriod: number;
  status?: "active" | "inactive";
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  id: string;
}

export interface ProductsResponse {
  products: Product[];
  //   total: number;
  //   page: number;
  //   limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}
