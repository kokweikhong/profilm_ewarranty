// Warranty represents the warranty entity
export interface Warranty {
  id: number;
  shopId: number;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  carBrand: string;
  carModel: string;
  carColour: string;
  carPlateNo: string;
  carChassisNo: string;
  installationDate: string; // ISO date string
  referenceNo?: string;
  warrantyNo: string;
  invoiceAttachmentUrl: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface WarrantyDetails extends Warranty {
  shopName: string;
  branchCode: string;
}

export interface WarrantyCarPart {
  productAllocationId: number;
  carPart: string;
  installationImageUrl: string;
}

export interface CreateWarrantyRequest {
  shopId: number;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  carBrand: string;
  carModel: string;
  carColour: string;
  carPlateNo: string;
  carChassisNo: string;
  installationDate: string; // Format: YYYY-MM-DD
  referenceNo?: string; // Optional
  warrantyNo: string;
  invoiceAttachmentUrl: string;
}

// TODO: warranty no can't be changed
// TODO: branch code shouldn't be changed and need to disable in the form
export interface UpdateWarrantyRequest {
  id: number;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  carBrand: string;
  carModel: string;
  carColour: string;
  carPlateNo: string;
  carChassisNo: string;
  carParts: WarrantyCarPart[]; // Array of car parts with individual allocations
  installationDate: string; // Format: YYYY-MM-DD
  referenceNo?: string; // Optional
  warrantyNo: string;
  branchCode: string;
}

export interface CarPart {
  id: number;
  name: string;
  code: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CreateWarrantyPartRequest {
  productAllocationId: number;
  carPartId: number;
  installationImageUrl: string;
}

export interface CreateWarrantyWithPartsRequest {
  warranty: CreateWarrantyRequest;
  parts: CreateWarrantyPartRequest[];
}

export interface WarrantyPartDetails {
  id: number;
  warrantyId: number;
  productAllocationId: number;
  carPartId: number;
  installationImageUrl: string;
  isApproved: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  carPartName: string;
  carPartCode: string;
  filmSerialNumber: string;
  warrantyInMonths: number;
  productBrand: string;
  productType: string;
  productSeries: string;
  productName: string;
}

export interface WarrantyWithPartsResponse {
  warranty: Warranty;
  parts: Array<WarrantyPartDetails>;
}
