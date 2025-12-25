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
import { claimColumns } from "@/lib/tableColumns";
import { Claim } from "@/types/claimsType";
import { DebounceInput } from "@/components/DebounceInput";
import { TablePagination } from "@/components/TablePagination";
import { getClaimsApi } from "@/lib/apis/claimsApi";

export default function Page() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Current page index (starts at 0)
    pageSize: 10, // Number of rows per page
  });

  const table = useReactTable({
    data: claims,
    columns: claimColumns,
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
    getClaimsApi().then((data) => setClaims(data));
  }, []);

  console.log("Claims:", claims);
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Claims</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the claims in your account including their brand,
            type, series, name, warranty, film serial number, film quantity, and
            shipment number.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <a
            href="/admin/claims/create"
            className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Add New Claim
          </a>
        </div>
      </div>
      <div className="my-4">
        <DebounceInput
          type="text"
          placeholder="Search all columns..."
          className="max-w-sm rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:w-64 px-3 py-2"
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
        />
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8"
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
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Actions
                      </th>
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                      <td className="py-4 pr-3 pl-4 text-sm whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8">
                        <a
                          href={`/admin/claims/edit/${row.original.id}`}
                          className="text-primary hover:underline"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
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
