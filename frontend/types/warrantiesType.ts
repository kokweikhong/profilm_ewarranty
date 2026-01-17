export enum WarrantyApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

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
  approvalStatus: WarrantyApprovalStatus;
  remarks?: string;
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
  remarks?: string; // Optional
}

export interface UpdateWarrantyRequest extends CreateWarrantyRequest {
  id: number;
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
  remarks?: string; // Optional
}

export interface UpdateWarrantyPartRequest {
  id: number;
  warrantyId: number;
  productAllocationId: number;
  carPartId: number;
  installationImageUrl: string;
  remarks?: string; // Optional
}

export interface CreateWarrantyWithPartsRequest {
  warranty: CreateWarrantyRequest;
  parts: CreateWarrantyPartRequest[];
}

export interface UpdateWarrantyWithPartsRequest {
  warranty: UpdateWarrantyRequest;
  parts: UpdateWarrantyPartRequest[];
}

export interface WarrantyPartDetails {
  id: number;
  warrantyId: number;
  productAllocationId: number;
  carPartId: number;
  installationImageUrl: string;
  approvalStatus: WarrantyApprovalStatus;
  remarks?: string; // Optional
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

export interface WarrantySearchResult {
  warranty: WarrantyDetails;
  parts: WarrantyPartDetails[];
}
