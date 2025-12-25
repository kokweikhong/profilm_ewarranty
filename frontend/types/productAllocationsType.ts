export interface ProductAllocationsListResponse {
  allocationId: number;
  filmSerialNumber: string;
  productName: string;
  shopName: string;
  branchCode: string;
  filmQuantity: number;
  allocationDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ProductAllocation {
  id: number;
  productId: number;
  shopId: number;
  filmQuantity: number;
  allocationDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductAllocationRequest {
  productId: number;
  shopId: number;
  filmQuantity: number;
  allocationDate: string; // ISO date string
}

export interface UpdateProductAllocationRequest {
  id: number;
  productId: number;
  shopId: number;
  filmQuantity: number;
  allocationDate: string; // ISO date string
}

export interface ProductsFromAllocationByShopIdResponse {
  productAllocationId: number;
  productId: number;
  brandName: string;
  typeName: string;
  seriesName: string;
  productName: string;
  warrantyInMonths: number;
  filmSerialNumber: string;
  filmQuantity: number;
  shipmentNumber: string;
  description: string;
}
