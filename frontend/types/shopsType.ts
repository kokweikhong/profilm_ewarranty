export interface MsiaState {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: number;
  companyName: string;
  companyRegistrationNumber: string;
  companyLicenseImageURL: string;
  companyContactNumber: string;
  companyEmail: string;
  companyWebsiteUrl: string;
  shopName: string;
  shopAddress: string;
  msiaStateID: number;
  branchCode: string;
  shopImageURL: string;
  picName: string;
  picPosition: string;
  picContactNumber: string;
  picEmail: string;
  loginUsername: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShopRequest {
  companyName: string;
  companyRegistrationNumber: string;
  companyLicenseImageUrl?: string;
  companyContactNumber: string;
  companyEmail: string;
  companyWebsiteUrl: string;
  shopName: string;
  shopAddress: string;
  msiaStateId: number;
  branchCode: string;
  shopImageUrl?: string;
  picName: string;
  picPosition: string;
  picContactNumber: string;
  picEmail: string;
  loginUsername: string;
  loginPassword: string; // Plain text password for creation
}

export interface UpdateShopRequest {
  id: number;
  companyName: string;
  companyRegistrationNumber: string;
  companyLicenseImageUrl?: string;
  companyContactNumber: string;
  companyEmail: string;
  companyWebsiteUrl: string;
  shopName: string;
  shopAddress: string;
  msiaStateId: number;
  branchCode: string;
  shopImageUrl?: string;
  picName: string;
  picPosition: string;
  picContactNumber: string;
  picEmail: string;
  loginUsername: string;
  isActive: boolean;
}
