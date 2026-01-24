"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  getWarrantiesWithPartsByShopIdApi,
  getWarrantyWithPartsByIdApi,
} from "@/lib/apis/warrantiesApi";
import {
  WarrantyPartDetails,
  WarrantyWithPartsResponse,
} from "@/types/warrantiesType";
import { getClaimsByShopIdApi } from "@/lib/apis/claimsApi";
import { ClaimView } from "@/types/claimsType";
import ClaimForm from "../_components/ClaimForm";

export default function Page() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [warrantyParts, setWarrantyParts] = useState<WarrantyPartDetails[]>([]);

  // const [warranties, setWarranties] = useState<WarrantyWithPartsResponse[]>([]);
  // const [filteredWarranties, setFilteredWarranties] = useState<
  //   WarrantyWithPartsResponse[]
  // >([]);
  // const [selectedWarranty, setSelectedWarranty] =
  //   useState<WarrantyWithPartsResponse | null>(null);

  const [claims, setClaims] = useState<ClaimView[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<ClaimView[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<ClaimView | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch claims for the shop
  useEffect(() => {
    async function fetchClaims() {
      if (authLoading || !user?.shopId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const shopClaims = await getClaimsByShopIdApi(user.shopId);

        // FIXME: temporary commented out for testing
        // Filter warranties by shop ID
        // const shopWarranties = data.filter(
        //   (w) => w.shopId === user.shopId && w.isApproved
        // );

        // const shopWarranties = data.filter((w) => w.shopId === user.shopId);

        setClaims(shopClaims);
        setFilteredClaims(shopClaims);
      } catch (error: any) {
        console.error("Error loading warranties:", error);
        showToast("Failed to load warranties", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchClaims();
  }, [user, authLoading]);

  // Fetch warranty parts for if claim been selected
  useEffect(() => {
    async function fetchWarrantyParts() {
      if (authLoading || !user?.shopId || !selectedClaim) {
        return;
      }
      try {
        const data = await getWarrantyWithPartsByIdApi(
          selectedClaim.warrantyId,
        );

        setWarrantyParts(data.parts);
      } catch (error: any) {
        console.error("Error loading warranty parts:", error);
        showToast("Failed to load warranty parts", "error");
      }
    }

    if (selectedClaim) {
      fetchWarrantyParts();
    }
  }, [selectedClaim, user, authLoading, showToast]);

  // Search claims
  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      // setFilteredWarranties(warranties);
      setFilteredClaims(claims);
      return;
    }

    // Local search filtering
    const filtered = claims.filter(
      (c) =>
        c.claimNo?.toLowerCase().includes(value.toLowerCase()) ||
        c.carPlateNo?.toLowerCase().includes(value.toLowerCase()) ||
        c.clientName?.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredClaims(filtered);
  };

  // Select warranty
  // const handleSelectWarranty = (warrantyId: number) => {
  //   const warrantyData = warranties.find((w) => w.warranty?.id === warrantyId);
  //   if (warrantyData && warrantyData.warranty) {
  //     setSelectedWarranty(warrantyData);
  //   }
  // };

  // Select claim
  const handleSelectClaim = (claimId: number) => {
    const claimData = claims.find((c) => c.id === claimId);
    if (claimData) {
      setSelectedClaim(claimData);
    }
  };

  // Check user permissions
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
            Only shop users can create claims. Please contact your
            administrator.
          </p>
          <button
            onClick={() => router.push("/admin/claims")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Claim</h1>
          <p className="mt-1 text-sm text-gray-600">
            Search and select a warranty to create a claim
          </p>
        </div>
      </div>

      {!selectedClaim ? (
        <div className="bg-white  rounded-lg shadow">
          {/* Search Box */}
          <div className="p-6 border-b border-gray-200">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700  mb-2"
            >
              Search Warranty
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by Warranty Number, Car Plate Number, or Client Name"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300  rounded-md leading-5 bg-white  text-gray-900  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Warranties List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-600">Loading warranties...</p>
              </div>
            ) : filteredClaims.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No warranties found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm
                    ? "Try a different search term"
                    : "No approved warranties available for your shop"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClaims.map((data) => {
                  if (!data) return null;
                  return (
                    <div
                      key={data.id}
                      onClick={() => handleSelectClaim(data.id)}
                      className="border border-gray-200  rounded-lg p-4 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {data.warrantyNo}
                            </span>
                            <span className="font-mono text-sm text-gray-900">
                              {data.carPlateNo}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>
                              <span className="text-gray-500">Client:</span>
                              <span className="ml-2 text-gray-900">
                                {data.clientName}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Car:</span>
                              <span className="ml-2 text-gray-900">
                                {data.carBrand} {data.carModel}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Installation:
                              </span>
                              <span className="ml-2 text-gray-900">
                                {new Date(
                                  data.installationDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Reference Number:
                              </span>
                              <span className="ml-2 text-gray-900">
                                {data.referenceNo || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : selectedClaim ? (
        <ClaimForm
          claimData={{ claim: selectedClaim, parts: [] }}
          isEditMode={false}
          warrantyParts={warrantyParts}
          onCancel={() => setSelectedClaim(null)}
        />
      ) : null}
    </div>
  );
}
