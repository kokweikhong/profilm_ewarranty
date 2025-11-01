// Converted from Go VwProductDetail struct
export interface VwProductDetail {
  product_id: string;
  product_name: string;
  product_series: string;
  product_type: string;
  product_brand: string;
  warranty_years: number;
  film_serial_no: string;
  film_quantity: number;
  film_shipment_no: string;
  created_at: string;
  updated_at: string;
}

// Alternative interface with camelCase naming (recommended for frontend)
export interface ProductDetail {
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

// Legacy Product interface - can be updated to match backend or removed
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

export interface ProductListResponse {
  products: ProductDetail[];
  //   total: number;
  //   page: number;
  //   limit: number;
}

// Alternative response using snake_case to match backend exactly
export interface VwProductListResponse {
  products: VwProductDetail[];
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

// Utility functions to convert between formats
export const convertVwProductToProductDetail = (
  vwProduct: VwProductDetail
): ProductDetail => {
  return {
    productId: vwProduct.product_id,
    productName: vwProduct.product_name,
    productSeries: vwProduct.product_series,
    productType: vwProduct.product_type,
    productBrand: vwProduct.product_brand,
    warrantyYears: vwProduct.warranty_years,
    filmSerialNo: vwProduct.film_serial_no,
    filmQuantity: vwProduct.film_quantity,
    filmShipmentNo: vwProduct.film_shipment_no,
    createdAt: vwProduct.created_at,
    updatedAt: vwProduct.updated_at,
  };
};

export const convertProductDetailToVwProduct = (
  product: ProductDetail
): VwProductDetail => {
  return {
    product_id: product.productId,
    product_name: product.productName,
    product_series: product.productSeries,
    product_type: product.productType,
    product_brand: product.productBrand,
    warranty_years: product.warrantyYears,
    film_serial_no: product.filmSerialNo,
    film_quantity: product.filmQuantity,
    film_shipment_no: product.filmShipmentNo,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  };
};

export const convertVwProductListToProducts = (
  vwList: VwProductDetail[]
): Product[] => {
  return vwList.map((vwProduct) => ({
    id: vwProduct.product_id,
    name: vwProduct.product_name,
    series: vwProduct.product_series,
    type: vwProduct.product_type,
    brand: vwProduct.product_brand,
    warrantyYears: vwProduct.warranty_years,
    filmSerialNo: vwProduct.film_serial_no,
    filmQuantity: vwProduct.film_quantity,
    filmShipmentNo: vwProduct.film_shipment_no,
    createdAt: vwProduct.created_at,
    updatedAt: vwProduct.updated_at,
  }));
};
