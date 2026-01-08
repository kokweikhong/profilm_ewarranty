"use client";

import { useEffect, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";
import { ClaimColumns } from "@/components/TableColumns";
import { ClaimView } from "@/types/claimsType";
import { DebounceInput } from "@/components/DebounceInput";
import { TablePagination } from "@/components/TablePagination";
import { getClaimsApi, getClaimsByShopIdApi } from "@/lib/apis/claimsApi";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Page() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<ClaimView[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Current page index (starts at 0)
    pageSize: 10, // Number of rows per page
  });

  const table = useReactTable({
    data: claims,
    columns: ClaimColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  useEffect(() => {
    if (user?.role === "admin") {
      // If user is admin, fetch all claims
      getClaimsApi().then((data) => {
        setClaims(data);
        console.log("admin claims", data);
      });
    } else if (user?.shopId) {
      // If user is shop_admin, fetch claims by shop ID
      getClaimsByShopIdApi(user.shopId).then((data) => {
        setClaims(data);
        console.log("shop claims", data);
      });
    }
  }, [user?.role, user?.shopId]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <DocumentTextIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Claims Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === "admin"
                  ? "View and manage all warranty claims across all shops"
                  : "View and manage warranty claims for your shop"}
              </p>
            </div>
          </div>
        </div>

        {user?.role === "shop_admin" && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <a
              href="/admin/claims/create"
              className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Claim
            </a>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-blue-500/10 p-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Claims
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {claims.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-green-500/10 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Approved
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {claims.filter((c) => c.isApproved).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-amber-500/10 p-3">
                <svg
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Pending
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {claims.filter((c) => !c.isApproved).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <DebounceInput
            type="text"
            placeholder="Search claims by ID, claim number, warranty ID..."
            className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-primary transition-colors"
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        </div>
      </div>
      {/* Table Section */}
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <div className="max-h-[calc(100vh-480px)] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            scope="col"
                            className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 py-3.5 px-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? "group inline-flex items-center gap-2 cursor-pointer select-none hover:text-primary transition-colors"
                                    : "inline-flex items-center",
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getCanSort() && (
                                  <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-primary">
                                    {{
                                      asc: (
                                        <ChevronUpIcon className="h-4 w-4" />
                                      ),
                                      desc: (
                                        <ChevronDownIcon className="h-4 w-4" />
                                      ),
                                    }[
                                      header.column.getIsSorted() as string
                                    ] ?? (
                                      <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                        />
                                      </svg>
                                    )}
                                  </span>
                                )}
                              </div>
                            )}
                          </th>
                        ))}
                        {user?.role === "shop_admin" && (
                          <th
                            scope="col"
                            className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 py-3.5 px-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                          >
                            Actions
                          </th>
                        )}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={ClaimColumns.length + 1}
                          className="px-3 py-12 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              No claims found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {globalFilter
                                ? "Try adjusting your search terms"
                                : "Get started by creating a new claim"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                          {user?.role === "shop_admin" && (
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/claims/edit/${row.original.id}`}
                                  className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                  </svg>
                                  Edit
                                </Link>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
