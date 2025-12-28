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
  CubeIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import { ProductAllocationsListResponse } from "@/types/productAllocationsType";
import { ProductAllocationColumns } from "@/components/TableColumns";
import { DebounceInput } from "@/components/DebounceInput";
import { TablePagination } from "@/components/TablePagination";
import { getProductAllocationsApi } from "@/lib/apis/productAllocationsApi";

export default function Page() {
  const [productAllocations, setProductAllocations] = useState<
    ProductAllocationsListResponse[]
  >([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Current page index (starts at 0)
    pageSize: 10, // Number of rows per page
  });

  const table = useReactTable({
    data: productAllocations,
    columns: ProductAllocationColumns,
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
    getProductAllocationsApi().then((data) => setProductAllocations(data));
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <CubeIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Allocations
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage product inventory allocated to shops
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <a
            href="/admin/product-allocations/create"
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Allocation
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-blue-500/10 p-3">
                <CubeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Allocations
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {productAllocations.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-purple-500/10 p-3">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Products
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {new Set(productAllocations.map((p) => p.productName)).size}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-indigo-500/10 p-3">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Quantity
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {productAllocations.reduce(
                    (sum, p) => sum + p.filmQuantity,
                    0
                  )}
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
            placeholder="Search allocations by product, shop, serial number..."
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
                        <th
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 py-3.5 px-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                        >
                          Actions
                        </th>
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={ProductAllocationColumns.length + 1}
                          className="px-3 py-12 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <CubeIcon className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              No allocations found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {globalFilter
                                ? "Try adjusting your search terms"
                                : "Get started by creating a new allocation"}
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
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <a
                              href={`/admin/product-allocations/edit/${row.original.allocationId}`}
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
                            </a>
                          </td>
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
