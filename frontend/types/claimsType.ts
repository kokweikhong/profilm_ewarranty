export interface Claim {
  id: number;
  warrantyId: number;
  claimNo: string;
  claimDate: string;
  isApproved: boolean;
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

export interface CreateClaimWarrantyPartRequest {
  claimId: number;
  warrantyPartId: number;
  damagedImageUrl: string;
  remarks?: string;
  resolutionDate: string;
  resolutionImageUrl: string;
}
