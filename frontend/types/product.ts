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
  productNameId: string;
  productBrandId: string;
  warrantyYears: number;
  filmSerialNo: string;
  filmQuantity: number;
  filmShipmentNo: string;
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
