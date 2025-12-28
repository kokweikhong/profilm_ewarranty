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
      if (authLoading || !user || !user.shopId) {
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

  if (authLoading || loading) {
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
