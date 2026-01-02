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
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import { WarrantyDetails } from "@/types/warrantiesType";
import { WarrantyColumns } from "@/components/TableColumns";
import { DebounceInput } from "@/components/DebounceInput";
import { TablePagination } from "@/components/TablePagination";
import { getWarrantiesApi } from "@/lib/apis/warrantiesApi";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
  const [warranties, setWarranties] = useState<WarrantyDetails[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Current page index (starts at 0)
    pageSize: 10, // Number of rows per page
  });
  const { user } = useAuth();

  const table = useReactTable<WarrantyDetails>({
    data: warranties,
    columns: WarrantyColumns,
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
    getWarrantiesApi().then((data) => {
      // Filter warranties by shop_id if user is not admin
      const filteredData =
        user?.role !== "admin" && user?.shopId
          ? data.filter((warranty) => warranty.shopId === user.shopId)
          : data;
      setWarranties(filteredData);
    });
  }, [user]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ShieldCheckIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Warranties Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === "admin"
                  ? "View and manage all product warranties across all shops"
                  : "View and manage product warranties for your shop"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <a
            href="/admin/warranties/create"
            className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Warranty
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-blue-500/10 p-3">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Warranties
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {warranties.length}
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
                  Active
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {warranties.filter((w) => w.isActive).length}
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
                  {warranties.filter((w) => w.isApproved).length}
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
            placeholder="Search warranties by number, client name, car details..."
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
                          colSpan={WarrantyColumns.length + 1}
                          className="px-3 py-12 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <ShieldCheckIcon className="h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              No warranties found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {globalFilter
                                ? "Try adjusting your search terms"
                                : "Get started by creating a new warranty"}
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
                            <div className="flex items-center gap-2">
                              <a
                                href={`/admin/warranties/details/${row.original.id}`}
                                className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
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
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                View
                              </a>

                              {/* Hide if is admin role */}
                              {user?.role !== "admin" && (
                                <a
                                  href={`/admin/warranties/edit/${row.original.id}`}
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
                              )}
                            </div>
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
