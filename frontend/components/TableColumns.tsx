import { createColumnHelper } from "@tanstack/react-table";
import { ProductDetailResponse } from "@/types/productsType";
import { Shop, ShopListResponse } from "@/types/shopsType";
import { ProductAllocationsListResponse } from "@/types/productAllocationsType";
import {
  Warranty,
  WarrantyApprovalStatus,
  WarrantyDetails,
} from "@/types/warrantiesType";
import { ClaimView } from "@/types/claimsType";
import { ListUsersResponse } from "@/types/usersType";
import Link from "next/link";

const productColumnHelper = createColumnHelper<ProductDetailResponse>();
export const ProductColumns = [
  productColumnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        #{info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("productName", {
    header: "Product Name",
    cell: (info) => (
      <span className="font-medium text-gray-900">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("brandName", {
    header: "Brand",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("typeName", {
    header: "Type",
    cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
    enableSorting: true,
  }),
  productColumnHelper.accessor("seriesName", {
    header: "Series",
    cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
    enableSorting: true,
  }),
  productColumnHelper.accessor("warrantyInMonths", {
    header: "Warranty",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
        {info.getValue()} months
      </span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("filmSerialNumber", {
    header: "Serial Number",
    cell: (info) => (
      <span className="font-mono text-xs text-gray-600">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("filmQuantity", {
    header: "Quantity",
    cell: (info) => (
      <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("shipmentNumber", {
    header: "Shipment",
    cell: (info) => (
      <span className="font-mono text-xs text-gray-600">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) =>
      info.getValue() ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          <svg
            className="h-1.5 w-1.5 fill-green-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          <svg
            className="h-1.5 w-1.5 fill-gray-400"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Inactive
        </span>
      ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span className="text-xs text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
  productColumnHelper.accessor("updatedAt", {
    header: "Updated",
    cell: (info) => (
      <span className="text-xs text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
];

const shopColumnHelper = createColumnHelper<Shop>();
export const ShopColumns = [
  shopColumnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        #{info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyName", {
    header: "Company",
    cell: (info) => (
      <span className="font-semibold text-gray-900">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyRegistrationNumber", {
    header: "Registration",
    cell: (info) => (
      <span className="font-mono text-xs text-gray-600">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyContactNumber", {
    header: "Contact",
    cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyEmail", {
    header: "Email",
    cell: (info) => (
      <span className="text-gray-600 text-xs">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("companyWebsiteUrl", {
    header: "Website",
    cell: (info) => (
      <a
        href={info.getValue()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline text-xs"
      >
        {info.getValue()}
      </a>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("shopName", {
    header: "Shop Name",
    cell: (info) => (
      <span className="font-medium text-gray-900">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("shopAddress", {
    header: "Address",
    cell: (info) => (
      <span className="text-gray-600 text-xs">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("msiaStateName", {
    header: "State",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("branchCode", {
    header: "Branch",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picName", {
    header: "PIC Name",
    cell: (info) => <span className="text-gray-900">{info.getValue()}</span>,
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picPosition", {
    header: "Position",
    cell: (info) => (
      <span className="text-gray-600 text-xs">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picContactNumber", {
    header: "PIC Contact",
    cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
    enableSorting: true,
  }),
  shopColumnHelper.accessor("picEmail", {
    header: "PIC Email",
    cell: (info) => (
      <span className="text-gray-600 text-xs">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("isActive", {
    header: "Status",
    cell: (info) =>
      info.getValue() ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          <svg
            className="h-1.5 w-1.5 fill-green-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          <svg
            className="h-1.5 w-1.5 fill-gray-400"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Inactive
        </span>
      ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
  shopColumnHelper.accessor("updatedAt", {
    header: "Last Updated",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
];

const productAllocationColumnHelper =
  createColumnHelper<ProductAllocationsListResponse>();
export const ProductAllocationColumns = [
  productAllocationColumnHelper.accessor("allocationId", {
    header: "ID",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        #{info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("filmSerialNumber", {
    header: "Serial Number",
    cell: (info) => (
      <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("productName", {
    header: "Product",
    cell: (info) => (
      <span className="font-semibold text-gray-900">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("shopName", {
    header: "Shop",
    cell: (info) => <span className="text-gray-900">{info.getValue()}</span>,
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("branchCode", {
    header: "Branch",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("filmQuantity", {
    header: "Quantity",
    cell: (info) => (
      <span className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("allocationDate", {
    header: "Allocation Date",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="text-gray-900 font-medium">
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            weekday: "short",
          })}
        </span>
      </div>
    ),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
  productAllocationColumnHelper.accessor("updatedAt", {
    header: "Last Updated",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
];

const warrantyColumnHelper = createColumnHelper<WarrantyDetails>();
export const WarrantyColumns = [
  warrantyColumnHelper.accessor("warrantyNo", {
    header: "Warranty Number",
    cell: (info) => (
      <Link
        href={`/admin/warranties/details/${info.row.original.id}`}
        className="font-semibold text-primary hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("approvalStatus", {
    header: "Approval Status",
    cell: (info) =>
      info.getValue() === WarrantyApprovalStatus.APPROVED ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          <svg
            className="h-1.5 w-1.5 fill-green-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Approved
        </span>
      ) : info.getValue() === WarrantyApprovalStatus.PENDING ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
          <svg
            className="h-1.5 w-1.5 fill-yellow-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Pending
        </span>
      ) : info.getValue() === WarrantyApprovalStatus.REJECTED ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
          <svg
            className="h-1.5 w-1.5 fill-red-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Rejected
        </span>
      ) : (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          <svg
            className="h-1.5 w-1.5 fill-gray-400"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Unknown
        </span>
      ),

    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("branchCode", {
    header: "Branch",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("shopName", {
    header: "Shop",
    cell: (info) => <span className="text-gray-900">{info.getValue()}</span>,
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("clientName", {
    header: "Client",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">{info.getValue()}</span>
      </div>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("clientContact", {
    header: "Contact",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("clientEmail", {
    header: "Email",
    cell: (info) => (
      <span className="text-gray-600 text-xs">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carBrand", {
    header: "Car Brand",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carModel", {
    header: "Model",
    cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carColour", {
    header: "Colour",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carPlateNo", {
    header: "Car Plate Number",
    cell: (info) => (
      <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("carChassisNo", {
    header: "Chassis Number",
    cell: (info) => (
      <span className="font-mono text-xs text-gray-600">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("installationDate", {
    header: "Installation Date",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="text-gray-900 font-medium">
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            weekday: "short",
          })}
        </span>
      </div>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("referenceNo", {
    header: "Reference",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
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
    header: "Created",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
  warrantyColumnHelper.accessor("updatedAt", {
    header: "Last Updated",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
];

const claimColumnHelper = createColumnHelper<ClaimView>();
export const ClaimColumns = [
  claimColumnHelper.accessor("claimNo", {
    header: "Claim Number",
    cell: (info) => (
      <Link
        href={`/admin/claims/details/${info.row.original.id}`}
        className="font-semibold text-primary hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("claimDate", {
    header: "Claim Date",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="text-gray-900 font-medium">
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            weekday: "short",
          })}
        </span>
      </div>
    ),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("warrantyNo", {
    header: "Warranty Number",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("carPlateNo", {
    header: "Car Plate Number",
    cell: (info) => (
      <span className="font-mono text-sm text-gray-900">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("approvalStatus", {
    header: "Approval Status",
    cell: (info) =>
      info.getValue() === "APPROVED" ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          <svg
            className="h-1.5 w-1.5 fill-green-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Approved
        </span>
      ) : info.getValue() === "PENDING" ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <svg
            className="h-1.5 w-1.5 fill-amber-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Pending
        </span>
      ) : info.getValue() === "REJECTED" ? (
        <span className="inline-flex items-center gap-x-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
          <svg
            className="h-1.5 w-1.5 fill-red-500"
            viewBox="0 0 6 6"
            aria-hidden="true"
          >
            <circle cx={3} cy={3} r={3} />
          </svg>
          Rejected
        </span>
      ) : null,
    enableSorting: true,
  }),
  claimColumnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const statusConfig = {
        open: {
          bg: "bg-blue-50",
          text: "text-blue-700",
          ring: "ring-blue-700/10",
          label: "Open",
        },
        closed: {
          bg: "bg-gray-50",
          text: "text-gray-700",
          ring: "ring-gray-500/10",
          label: "Closed",
        },
      };
      const config = statusConfig[status as keyof typeof statusConfig] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        ring: "ring-gray-500/10",
        label: status,
      };
      return (
        <span
          className={`inline-flex items-center rounded-md ${config.bg} px-2 py-1 text-xs font-medium ${config.text} ring-1 ring-inset ${config.ring}`}
        >
          {config.label}
        </span>
      );
    },
    enableSorting: true,
  }),
  claimColumnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
  claimColumnHelper.accessor("updatedAt", {
    header: "Last Updated",
    cell: (info) => (
      <span className="text-sm text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
];

const userColumnHelper = createColumnHelper<ListUsersResponse>();
export const UserColumns = [
  userColumnHelper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        #{info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  userColumnHelper.accessor("username", {
    header: "Username",
    cell: (info) => (
      <span className="font-semibold text-gray-900">{info.getValue()}</span>
    ),
    enableSorting: true,
  }),
  userColumnHelper.accessor("role", {
    header: "Role",
    cell: (info) => {
      const role = info.getValue();
      const roleConfig = {
        admin: {
          bg: "bg-purple-50",
          text: "text-purple-700",
          ring: "ring-purple-700/10",
          label: "Admin",
        },
        shop_admin: {
          bg: "bg-blue-50",
          text: "text-blue-700",
          ring: "ring-blue-700/10",
          label: "Shop Admin",
        },
      };
      const config = roleConfig[role as keyof typeof roleConfig] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        ring: "ring-gray-500/10",
        label: role,
      };
      return (
        <span
          className={`inline-flex items-center rounded-md ${config.bg} px-2 py-1 text-xs font-medium ${config.text} ring-1 ring-inset ${config.ring}`}
        >
          {config.label}
        </span>
      );
    },
    enableSorting: true,
  }),
  userColumnHelper.accessor("shopName", {
    header: "Shop",
    cell: (info) => {
      const shopName = info.getValue();
      return shopName ? (
        <span className="text-gray-700">{shopName}</span>
      ) : (
        <span className="text-gray-400 italic">N/A</span>
      );
    },
    enableSorting: true,
  }),
  userColumnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span className="text-xs text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
  userColumnHelper.accessor("updatedAt", {
    header: "Last Updated",
    cell: (info) => (
      <span className="text-xs text-gray-500">
        {new Date(info.getValue()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
    enableSorting: true,
  }),
];
