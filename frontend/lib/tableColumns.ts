import { createColumnHelper } from "@tanstack/react-table";
import { ProductListResponse } from "@/types/productsType";
import { Shop, ShopListResponse } from "@/types/shopsType";
import { ProductAllocationsListResponse } from "@/types/productAllocationsType";
import { WarrantyView, Warranty } from "@/types/warrantiesType";
import { Claim } from "@/types/claimsType";

const productColumnHelper = createColumnHelper<ProductListResponse>();
export const productColumns = [
  productColumnHelper.accessor("productId", {
    header: "Product ID",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("productName", {
    header: "Product Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("brandName", {
    header: "Brand Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("typeName", {
    header: "Type Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("seriesName", {
    header: "Series Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("warrantyPeriod", {
    header: "Warranty (months)",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("filmSerialNumber", {
    header: "Film Serial Number",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("filmQuantity", {
    header: "Film Quantity",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("shipmentNumber", {
    header: "Shipment Number",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("isActive", {
    header: "Active",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
    enableSorting: true,
  }),
  productColumnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  productColumnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
];

const shopColumnHelper = createColumnHelper<Shop>();
export const shopColumns = [
  shopColumnHelper.accessor("id", {
    header: "Shop ID",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyName", {
    header: "Company Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyRegistrationNumber", {
    header: "Registration Number",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyContactNumber", {
    header: "Contact Number",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyEmail", {
    header: "Email",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyWebsiteUrl", {
    header: "Website URL",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("shopName", {
    header: "Shop Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("shopAddress", {
    header: "Shop Address",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("msiaStateName", {
    header: "State",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("branchCode", {
    header: "Branch Code",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picName", {
    header: "PIC Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picPosition", {
    header: "PIC Position",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picContactNumber", {
    header: "PIC Contact Number",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picEmail", {
    header: "PIC Email",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("isActive", {
    header: "Active",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
];

const productAllocationColumnHelper =
  createColumnHelper<ProductAllocationsListResponse>();
export const productAllocationColumns = [
  productAllocationColumnHelper.accessor("allocationId", {
    header: "Allocation ID",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("filmSerialNumber", {
    header: "Film Serial Number",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("productName", {
    header: "Product Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("shopName", {
    header: "Shop Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("branchCode", {
    header: "Branch Code",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("filmQuantity", {
    header: "Film Quantity",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("allocationDate", {
    header: "Allocation Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
];

const warrantyColumnHelper = createColumnHelper<WarrantyView>();
export const warrantyColumns = [
  warrantyColumnHelper.accessor("clientName", {
    header: "Client Name",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("clientContact", {
    header: "Client Contact",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("clientEmail", {
    header: "Client Email",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carBrand", {
    header: "Car Brand",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carModel", {
    header: "Car Model",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carColour", {
    header: "Car Colour",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carPlateNo", {
    header: "Car Plate No",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carChassisNo", {
    header: "Car Chassis No",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("installationDate", {
    header: "Installation Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("referenceNo", {
    header: "Reference No",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("warrantyNo", {
    header: "Warranty No",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  // warrantyColumnHelper.accessor("invoiceAttachmentUrl", {
  //   header: "Invoice Attachment URL",
  //   cell: (info) => info.getValue(),
  //   enableSorting: true,
  // }),
  // warrantyColumnHelper.accessor("isActive", {
  //   header: "Active",
  //   cell: (info) => (info.getValue() ? "Yes" : "No"),
  //   enableSorting: true,
  // }),
  // warrantyColumnHelper.accessor("isApproved", {
  //   header: "Approved",
  //   cell: (info) => (info.getValue() ? "Yes" : "No"),
  //   enableSorting: true,
  // }),
  warrantyColumnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
];

const claimColumnHelper = createColumnHelper<Claim>();
export const claimColumns = [
  claimColumnHelper.accessor("id", {
    header: "Claim ID",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("warrantyId", {
    header: "Warranty ID",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("claimNo", {
    header: "Claim No",
    cell: (info) => info.getValue(),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("claimDate", {
    header: "Claim Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("isApproved", {
    header: "Approved",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
];
