"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ShopForm from "../../_components/ShopForm";
import { getMsiaStatesApi, getShopByIdApi } from "@/lib/apis/shopsApi";
import { MsiaState, Shop } from "@/types/shopsType";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const [shop, setShop] = useState<Shop | null>(null);
  const [msiaStates, setMsiaStates] = useState<MsiaState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shopData, statesData] = await Promise.all([
          getShopByIdApi(Number(id)),
          getMsiaStatesApi(),
        ]);
        setShop(shopData);
        setMsiaStates(statesData);
      } catch (err: any) {
        console.error("Error loading shop data:", err);
        setError("Failed to load shop data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading shop data...</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Shop
          </h3>
          <p className="text-gray-600 mb-4">{error || "Shop not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ShopForm msiaStates={msiaStates} shop={shop} mode="update" />
    </div>
  );
}
