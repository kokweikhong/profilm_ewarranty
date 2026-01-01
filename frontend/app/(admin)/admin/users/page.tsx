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
  MagnifyingGlassIcon,
  UserGroupIcon,
  KeyIcon,
} from "@heroicons/react/20/solid";
import { ListUsersResponse } from "@/types/usersType";
import { UserColumns } from "@/components/TableColumns";
import { DebounceInput } from "@/components/DebounceInput";
import { TablePagination } from "@/components/TablePagination";
import { getUsersApi, resetPasswordApi } from "@/lib/apis/authApi";
import { useToast } from "@/contexts/ToastContext";

export default function Page() {
  const [users, setUsers] = useState<ListUsersResponse[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);
  const [resettingPassword, setResettingPassword] = useState<number | null>(
    null
  );
  const { showToast } = useToast();

  const table = useReactTable({
    data: users,
    columns: UserColumns,
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersApi();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId: number, username: string) => {
    if (
      !confirm(
        `Are you sure you want to reset password for user "${username}"?`
      )
    ) {
      return;
    }

    try {
      setResettingPassword(userId);
      await resetPasswordApi(userId);
      showToast("Password reset successfully", "success");
    } catch (error) {
      console.error("Error resetting password:", error);
      showToast("Failed to reset password", "error");
    } finally {
      setResettingPassword(null);
    }
  };

  const adminCount = users.filter((u) => u.role === "admin").length;
  const shopAdminCount = users.filter((u) => u.role === "shop_admin").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <UserGroupIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all system users and their access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-blue-500/10 p-3">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Users
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {users.length}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-purple-500/10 p-3">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Admin Users
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {adminCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="rounded-md bg-green-500/10 p-3">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Shop Admins
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {shopAdminCount}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <DebounceInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search users..."
            debounce={300}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 bg-white">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "flex items-center gap-2 cursor-pointer select-none hover:text-primary transition-colors"
                                  : "flex items-center gap-2",
                                onClick:
                                  header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <span className="flex flex-col">
                                  <ChevronUpIcon
                                    className={`h-3 w-3 ${
                                      header.column.getIsSorted() === "asc"
                                        ? "text-primary"
                                        : "text-gray-400"
                                    }`}
                                  />
                                  <ChevronDownIcon
                                    className={`h-3 w-3 -mt-1.5 ${
                                      header.column.getIsSorted() === "desc"
                                        ? "text-primary"
                                        : "text-gray-400"
                                    }`}
                                  />
                                </span>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                        colSpan={table.getAllColumns().length + 1}
                        className="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/50">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="whitespace-nowrap px-3 py-4 text-sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <button
                            onClick={() =>
                              handleResetPassword(
                                row.original.id,
                                row.original.username
                              )
                            }
                            disabled={resettingPassword === row.original.id}
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-50 px-2.5 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <KeyIcon className="h-4 w-4" />
                            {resettingPassword === row.original.id
                              ? "Resetting..."
                              : "Reset Password"}
                          </button>
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

      {/* Pagination */}
      <TablePagination table={table} />
    </div>
  );
}
