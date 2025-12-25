export interface Claim {
  id: number;
  warrantyId: number;
  claimNo: string;
  claimDate: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
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
  warrantyParts: ClaimWarrantyPart[];
}

export interface UpdateClaimRequest {
  id: number;
  warrantyId: number;
  claimNo: string;
  claimDate: string;
  isApproved: boolean;
  warrantyParts: ClaimWarrantyPart[];
}

export interface WarrantyPart {
  id: number;
  warrantyId: number;
  carPartId: number;
  carPartName: string;
  productAllocationId: number;
  installationImageUrl: string;
}

export interface WarrantySearchResult {
  warrantyId: number;
  warrantyNo: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  carBrand: string;
  carModel: string;
  carPlateNo: string;
  carChassisNo: string;
  shopName: string;
  branchCode: string;
  installationDate: string;
  warrantyParts?: WarrantyPart[];
}

export interface CreateClaimWarrantyPartRequest {
  claimId: number;
  warrantyPartId: number;
  damagedImageUrl: string;
  remarks?: string;
  resolutionDate: string;
  resolutionImageUrl: string;
}
