export interface ClaimView {
  id: number;
  warrantyId: number;
  claimNo: string;
  claimDate: string;
  isApproved: boolean;
  status: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  shopId: number;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  carBrand: string;
  carModel: string;
  carColour: string;
  carPlateNo: string;
  carChassisNo: string;
  installationDate: string;
  referenceNo?: string;
  warrantyNo: string;
  invoiceAttachmentUrl: string;
}

export interface ClaimWarrantyPartsView {
  id: number;
  claimId: number;
  warrantyPartId: number;
  damagedImageUrl: string;
  status: string;
  remarks?: string;
  resolutionDate?: string;
  resolutionImageUrl?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  installationImageUrl: string;
  carPartName: string;
  carPartCode: string;
  productAllocationId: number;
  brandName: string;
  typeName: string;
  seriesName: string;
  productName: string;
  filmSerialNumber: string;
  warrantyInMonths: number;
}

export interface Claim {
  id: number;
  warrantyId: number;
  claimNo: string;
  claimDate: string;
  isApproved: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListClaimsResponse extends Claim {
  warrantyNo: string;
  carPlateNo: string;
}

export interface ClaimWarrantyPart {
  warrantyPartId: number;
  carPartName: string;
  damagedImageUrl: string;
  remarks?: string;
  resolutionDate: string;
  resolutionImageUrl: string;
}

export interface CreateClaimRequest {
  warrantyId: number;
  claimNo: string;
  claimDate: string;
}

export interface CreateClaimWarrantyPartRequest {
  claimId: number;
  warrantyPartId: number;
  damagedImageUrl: string;
  remarks?: string;
  resolutionDate?: string;
  resolutionImageUrl?: string;
}

export interface CreateClaimWithPartsRequest {
  claim: CreateClaimRequest;
  parts: CreateClaimWarrantyPartRequest[];
}

export interface UpdateClaimRequest {
  id: number;
  warrantyId: number;
  claimNo: string;
  claimDate: string;
}

export interface UpdateClaimWarrantyPartRequest {
  id: number;
  warrantyPartId: number;
  damagedImageUrl: string;
  status: string;
  remarks?: string;
  resolutionDate?: string;
  resolutionImageUrl?: string;
}

export interface UpdateClaimWithPartsRequest {
  claim: UpdateClaimRequest;
  parts: UpdateClaimWarrantyPartRequest[];
}

export interface ClaimWarrantyPartResponse {
  id: number;
  warrantyPartId: number;
  damagedImageUrl: string;
  status: string;
  remarks?: string;
  resolutionDate?: string;
  resolutionImageUrl?: string;
}

export interface ClaimDetail {
  id: number;
  warrantyId: number;
  claimNo: string;
  claimDate: string;
  isApproved: boolean;
  status: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  warrantyNo: string;
  carPlateNo: string;
}

export interface ClaimWarrantyPartDetail {
  id: number;
  claimId: number;
  warrantyPartId: number;
  damagedImageUrl: string;
  status: string;
  remarks?: string;
  resolutionDate?: string;
  resolutionImageUrl?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  installationImageUrl: string;
}

export interface ClaimWithPartsDetailResponse {
  claim: ClaimView;
  parts: ClaimWarrantyPartsView[];
}
