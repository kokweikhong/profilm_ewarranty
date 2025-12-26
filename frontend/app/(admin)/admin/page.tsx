"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalWarranties: number;
  totalClaims: number;
  pendingClaims: number;
  approvedWarranties: number;
  totalProducts?: number;
  totalShops?: number;
  totalAllocations?: number;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, using mock data
    const fetchStats = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (user?.role === "admin") {
          setStats({
            totalWarranties: 156,
            totalClaims: 42,
            pendingClaims: 12,
            approvedWarranties: 142,
            totalProducts: 25,
            totalShops: 18,
            totalAllocations: 89,
          });
        } else if (user?.role === "shop_admin") {
          setStats({
            totalWarranties: 24,
            totalClaims: 8,
            pendingClaims: 3,
            approvedWarranties: 21,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome back, <span className="font-medium">{user?.username}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Warranties Card */}
        <Link
          href="/admin/warranties"
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow sm:p-6"
        >
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Warranties
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats?.totalWarranties || 0}
          </dd>
          <div className="mt-2 text-sm text-gray-600">
            {stats?.approvedWarranties || 0} approved
          </div>
        </Link>

        {/* Claims Card */}
        <Link
          href="/admin/claims"
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow sm:p-6"
        >
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Claims
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats?.totalClaims || 0}
          </dd>
          <div className="mt-2 text-sm text-gray-600">
            {stats?.pendingClaims || 0} pending
          </div>
        </Link>

        {/* Admin-only stats */}
        {isAdmin && (
          <>
            {/* Products Card */}
            <Link
              href="/admin/products"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                Total Products
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {stats?.totalProducts || 0}
              </dd>
              <div className="mt-2 text-sm text-gray-600">Active inventory</div>
            </Link>

            {/* Shops Card */}
            <Link
              href="/admin/shops"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-md transition-shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                Total Shops
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {stats?.totalShops || 0}
              </dd>
              <div className="mt-2 text-sm text-gray-600">
                Registered partners
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/warranties"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs hover:border-gray-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  View Warranties
                </h3>
                <p className="text-sm text-gray-500">Manage warranty records</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/claims"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs hover:border-gray-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Process Claims
                </h3>
                <p className="text-sm text-gray-500">
                  Review and approve claims
                </p>
              </div>
            </div>
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/admin/products"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Manage Products
                    </h3>
                    <p className="text-sm text-gray-500">
                      Add and update products
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/shops"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Manage Shops
                    </h3>
                    <p className="text-sm text-gray-500">View partner shops</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/product-allocations"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg
                      className="h-6 w-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      Product Allocations
                    </h3>
                    <p className="text-sm text-gray-500">
                      Allocate products to shops
                    </p>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
