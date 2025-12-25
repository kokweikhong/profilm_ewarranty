export interface ProductListResponse {
  productId: number;
  brandName: string;
  typeName: string;
  seriesName: string;
  productName: string;
  warrantyPeriod: number;
  filmSerialNumber: string;
  filmQuantity: number;
  shipmentNumber: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  brandId: number;
  typeId: number;
  seriesId: number;
  nameId: number;
  warrantyInMonths: number;
  filmSerialNumber: string;
  filmQuantity: number;
  shipmentNumber: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  brandId: number;
  typeId: number;
  seriesId: number;
  nameId: number;
  warrantyInMonths: number;
  filmSerialNumber: string;
  filmQuantity: number;
  shipmentNumber: string;
  description: string;
}

export interface UpdateProductRequest {
  id: number;
  brandId: number;
  typeId: number;
  seriesId: number;
  nameId: number;
  warrantyInMonths: number;
  filmSerialNumber: string;
  filmQuantity: number;
  shipmentNumber: string;
  description: string;
  isActive: boolean;
}

export interface ProductBrand {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductType {
  id: number;
  brandId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSeries {
  id: number;
  typeId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductName {
  id: number;
  seriesId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
