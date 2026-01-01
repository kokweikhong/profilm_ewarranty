"use client";

import { useEffect, useState } from "react";
import { getCarPartsApi } from "@/lib/apis/warrantiesApi";
import WarrantyForm from "../_components/WarrantyForm";
import { getProductsFromAllocationByShopIdApi } from "@/lib/apis/productAllocationsApi";
import { CarPart } from "@/types/warrantiesType";
import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
  const { user, isLoading: authLoading } = useAuth();
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [productsFromAllocation, setProductsFromAllocation] = useState<
    ProductsFromAllocationByShopIdResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (authLoading) {
        return;
      }

      if (!user || !user.shopId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [carPartsData, productsData] = await Promise.all([
          getCarPartsApi(),
          getProductsFromAllocationByShopIdApi(user.shopId),
        ]);

        setCarParts(carPartsData);
        setProductsFromAllocation(productsData);
      } catch (err: any) {
        console.error("Error loading warranty form data:", err);
        setError(
          err?.response?.status === 401
            ? "Authentication failed. Please log in again."
            : "Failed to load warranty form data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.shopId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 mb-6">
            Only users associated with a shop are permitted to create
            warranties. Please contact your administrator for assistance.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-semibold">Error Loading Form</h3>
          <p className="text-red-600 mt-2">{error}</p>
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
    <div>
      <WarrantyForm
        carParts={carParts}
        productsFromAllocation={productsFromAllocation}
        mode="create"
      />
    </div>
  );
}
