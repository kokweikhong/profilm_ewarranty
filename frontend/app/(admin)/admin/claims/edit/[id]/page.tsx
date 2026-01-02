"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getClaimWithPartsByIdApi } from "@/lib/apis/claimsApi";
import { getWarrantyWithPartsByIdApi } from "@/lib/apis/warrantiesApi";
import {
  ClaimWithPartsDetailResponse,
  UpdateClaimWithPartsRequest,
} from "@/types/claimsType";
import { updateClaimAction } from "@/actions/claimsAction";
import { WarrantyWithPartsResponse } from "@/types/warrantiesType";
import ClaimForm from "../../_components/ClaimForm";
import WarrantyInformation from "../../_components/WarrantyInformation";

import { useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [claimData, setClaimData] =
    useState<ClaimWithPartsDetailResponse | null>(null);
  // const [warrantyData, setWarrantyData] =
  //   useState<WarrantyWithPartsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const claimId = Number(params.id);
  console.log("Page loaded with claim ID:", claimId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateClaimWithPartsRequest>({
    defaultValues: {
      claim: claimData?.claim,
      parts: claimData?.parts || [],
    },
  });

  // Fetch claim and warranty data
  useEffect(() => {
    async function fetchData() {
      if (authLoading) {
        return;
      }

      if (!claimId || isNaN(claimId)) {
        console.error("Invalid claim ID:", params.id);
        showToast("Invalid claim ID", "error");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching claim with ID:", claimId);

        // Fetch claim with parts
        const claim = await getClaimWithPartsByIdApi(claimId);
        console.log("Claim data:", claim);
        setClaimData(claim);

        // Fetch warranty with parts
        // const warranty = await getWarrantyWithPartsByIdApi(
        //   claim.claim.warrantyId
        // );
        // console.log("Warranty data:", warranty);
        // setWarrantyData(warranty);
      } catch (error: any) {
        console.error("Error loading claim:", error);
        console.error("Error details:", error.response?.data);
        showToast(
          `Failed to load claim data: ${
            error.response?.data?.message || error.message
          }`,
          "error"
        );
        // Don't redirect immediately, let user see the error
        // router.push("/admin/claims");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId, authLoading]);

  // Check authentication
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Only shop users can edit claims. Please contact your administrator.
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

  if (!claimData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Claim not found or you don't have permission to edit it.
          </p>
          <button
            onClick={() => router.push("/admin/claims")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: UpdateClaimWithPartsRequest) => {
    try {
      const result = await updateClaimAction(data);
      if (result.success) {
        showToast("Claim updated successfully", "success");
        router.push("/admin/claims");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      showToast(
        `Failed to update claim: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Claim
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update claim information and parts
          </p>
        </div>
      </div>

      {/* <WarrantyInformation claimData={claimData.claim} /> */}

      <ClaimForm
        claimData={claimData}
        onCancel={() => router.push("/admin/claims")}
        isEditMode={true}
      />
    </div>
  );
}
