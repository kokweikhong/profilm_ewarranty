import { createColumnHelper } from "@tanstack/react-table";
import { ProductListResponse } from "@/types/productsType";

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
