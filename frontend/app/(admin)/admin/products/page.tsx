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
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { ProductDetailResponse } from "@/types/productsType";
// import { productColumns } from "@/lib/tableColumns";
import { DebounceInput } from "@/components/DebounceInput";
import { TablePagination } from "@/components/TablePagination";
import { getApiBaseUrl } from "@/lib/env";
import apiClient from "@/lib/axios";
import { getProductsApi } from "@/lib/apis/productsApi";
import { ProductColumns } from "@/components/TableColumns";

export default function Page() {
  const [products, setProducts] = useState<ProductDetailResponse[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Current page index (starts at 0)
    pageSize: 10, // Number of rows per page
  });

  const table = useReactTable({
    data: products,
    columns: ProductColumns,
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
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProductsApi();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your product catalog including brand, type, series, warranty
            details, and inventory information.
          </p>
          <div className="mt-2 flex items-center gap-4">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {products.length} Total Products
            </span>
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {products.filter((p) => p.isActive).length} Active
            </span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <a
            href="/admin/products/create"
            className="inline-flex items-center gap-x-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            <svg
              className="-ml-0.5 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Product
          </a>
        </div>
      </div>
      <div className="mt-6 mb-4">
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <DebounceInput
            type="text"
            placeholder="Search products..."
            className="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        </div>
      </div>
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100/90 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none flex items-center gap-2 hover:text-primary"
                                  : "",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: <ChevronUpIcon className="w-4 h-4" />,
                                desc: <ChevronDownIcon className="w-4 h-4" />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-200 bg-linear-to-r from-gray-50 to-gray-100/90 py-3.5 pr-4 pl-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      >
                        Actions
                      </th>
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={100}
                        className="px-4 py-12 text-center text-sm text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="h-12 w-12 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                          <p className="text-gray-900 font-medium">
                            No products found
                          </p>
                          <p className="text-gray-500 mt-1">
                            Try adjusting your search
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row, rowIndex) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={`py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8 ${
                              rowIndex !== table.getRowModel().rows.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                        <td
                          className={`py-4 pr-4 pl-3 text-sm whitespace-nowrap sm:pr-6 lg:pr-8 ${
                            rowIndex !== table.getRowModel().rows.length - 1
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                        >
                          <a
                            href={`/admin/products/edit/${row.original.id}`}
                            className="inline-flex items-center gap-x-1.5 text-primary hover:text-primary/80 font-medium transition-colors"
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
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
      <TablePagination table={table} />
    </div>
  );
}
