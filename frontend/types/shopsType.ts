export interface MsiaState {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopListResponse {
  id: number;
  companyName: string;
  companyRegistrationNumber: string;
  companyContactNumber: string;
  companyEmail: string;
  companyWebsiteUrl: string;
  shopName: string;
  shopAddress: string;
  msiaStateName: string;
  branchCode: string;
  shopImageUrl?: string;
  picName: string;
  picPosition: string;
  picContactNumber: string;
  picEmail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// "id": 45,
// "companyName": "CarStyle Putrajaya",
// "companyRegistrationNumber": "5944031-X",
// "companyLicenseImageUrl": "https://example.com/licenses/company_15.jpg",
// "companyContactNumber": "+60-017-9016025",
// "companyEmail": "info@shop15.example.com",
// "companyWebsiteUrl": "https://shop15.example.com",
// "shopName": "CarStyle Putrajaya Branch",
// "shopAddress": "98, Jalan Example 15, Putrajaya",
// "msiaStateId": 15,
// "branchCode": "PJ04",
// "shopImageUrl": "https://example.com/shops/shop_15.jpg",
// "picName": "Ong Abdullah",
// "picPosition": "Manager",
// "picContactNumber": "+60-019-6116027",
// "picEmail": "manager15@shop15.example.com",
// "isActive": true,
// "createdAt": "2025-12-23T16:10:57.503153Z",
// "updatedAt": "2025-12-23T16:10:57.503153Z",
// "msiaStateName": "Putrajaya"

export interface Shop {
  id: number;
  companyName: string;
  companyRegistrationNumber: string;
  companyLicenseImageUrl: string;
  companyContactNumber: string;
  companyEmail: string;
  companyWebsiteUrl: string;
  shopName: string;
  shopAddress: string;
  msiaStateId: number;
  msiaStateName?: string;
  branchCode: string;
  shopImageUrl: string;
  picName: string;
  picPosition: string;
  picContactNumber: string;
  picEmail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const ShopDummyData: Shop = {
  id: 1,
  companyName: "Demo Company",
  companyRegistrationNumber: "123456789",
  companyLicenseImageUrl: "",
  companyContactNumber: "+60123456789",
  companyEmail: "demo@example.com",
  companyWebsiteUrl: "https://www.demo.com",
  shopName: "Demo Shop",
  shopAddress: "123 Demo Street, Demo City",
  msiaStateId: 1,
  branchCode: "",
  shopImageUrl: "",
  picName: "John Doe",
  picPosition: "Manager",
  picContactNumber: "+60129876543",
  picEmail: "john.doe@example.com",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
}

export const CreateShopRequestDummyData: CreateShopRequest = {
  companyName: "Demo Company",
  companyRegistrationNumber: "123456789",
  companyLicenseImageUrl: "",
  companyContactNumber: "+60123456789",
  companyEmail: "demo@example.com",
  companyWebsiteUrl: "https://www.demo.com",
  shopName: "Demo Shop",
  shopAddress: "123 Demo Street, Demo City",
  msiaStateId: 1,
  branchCode: "",
  shopImageUrl: "",
  picName: "John Doe",
  picPosition: "Manager",
  picContactNumber: "+60129876543",
  picEmail: "john.doe@example.com",
};

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
  isActive: boolean;
}
