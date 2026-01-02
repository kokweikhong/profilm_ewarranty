"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getClaimWithPartsByIdApi } from "@/lib/apis/claimsApi";
import { ClaimWithPartsDetailResponse } from "@/types/claimsType";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  updateClaimApprovalAction,
  updateClaimWarrantyPartApprovalAction,
  updateClaimStatusAction,
  updateClaimWarrantyPartStatusAction,
} from "@/actions/claimsAction";

export default function ClaimDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [claimData, setClaimData] =
    useState<ClaimWithPartsDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: "claim-approval" | "claim-status" | "part-approval" | "part-status";
    id: number;
    currentValue: boolean;
    title: string;
    message: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        setIsLoading(true);
        const id = parseInt(params.id as string);
        const data = await getClaimWithPartsByIdApi(id);
        setClaimData(data);
        console.log("Fetched claim details:", data);
      } catch (error: any) {
        console.error("Error fetching claim details:", error);
        showToast(error.message || "Failed to load claim details", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchClaimDetails();
    }
  }, [params.id, showToast]);

  const handleConfirmUpdate = async () => {
    if (!confirmModal || !claimData) return;

    setIsUpdating(true);
    try {
      let result;
      const newValue = !confirmModal.currentValue;

      switch (confirmModal.type) {
        case "claim-approval":
          result = await updateClaimApprovalAction(confirmModal.id, newValue);
          if (result.success) {
            setClaimData({
              ...claimData,
              claim: { ...claimData.claim, isApproved: newValue },
            });
            showToast("Claim approval status updated successfully", "success");
          }
          break;

        case "claim-status":
          result = await updateClaimStatusAction(confirmModal.id, newValue);
          console.log("Update claim status result:", newValue);
          if (result.success) {
            setClaimData({
              ...claimData,
              claim: {
                ...claimData.claim,
                status: newValue ? "open" : "closed",
              },
            });
            showToast("Claim status updated successfully", "success");
          }
          break;

        case "part-approval":
          result = await updateClaimWarrantyPartApprovalAction(
            confirmModal.id,
            newValue
          );
          if (result.success) {
            setClaimData({
              ...claimData,
              parts: claimData.parts.map((p) =>
                p.id === confirmModal.id ? { ...p, isApproved: newValue } : p
              ),
            });
            showToast("Part approval status updated successfully", "success");
          }
          break;

        case "part-status":
          result = await updateClaimWarrantyPartStatusAction(
            confirmModal.id,
            newValue
          );
          if (result.success) {
            setClaimData({
              ...claimData,
              parts: claimData.parts.map((p) =>
                p.id === confirmModal.id
                  ? { ...p, status: newValue ? "open" : "closed" }
                  : p
              ),
            });
            showToast("Part status updated successfully", "success");
          }
          break;
      }

      if (!result?.success) {
        showToast(result?.error || "Failed to update", "error");
      }
    } catch (error: any) {
      console.error("Error updating:", error);
      showToast(error.message || "Failed to update", "error");
    } finally {
      setIsUpdating(false);
      setConfirmModal(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!claimData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Claim not found</p>
        <button
          onClick={() => router.push("/admin/claims")}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Claims
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {confirmModal.message}
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={isUpdating}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpdate}
                disabled={isUpdating}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/admin/claims")}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-2 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Claims
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Claim Details
            </h1>
          </div>
        </div>

        {/* Claim Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Claim Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Claim Number
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.claimNo}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Claim Date
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {new Date(claimData.claim.claimDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Approval Status
              </label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    claimData.claim.isApproved
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {claimData.claim.isApproved ? "Approved" : "Not Approved"}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </label>
              <p className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {claimData.claim.status?.toUpperCase() || "N/A"}
                </span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Warranty Number
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.warrantyNo}
              </p>
            </div>
            {claimData.claim.referenceNo && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reference Number
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {claimData.claim.referenceNo}
                </p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Installation Date
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {new Date(
                  claimData.claim.installationDate
                ).toLocaleDateString()}
              </p>
            </div>
            {claimData.claim.remarks && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Remarks
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {claimData.claim.remarks}
                </p>
              </div>
            )}
            {claimData.claim.invoiceAttachmentUrl && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Invoice Attachment
                </label>
                <a
                  href={claimData.claim.invoiceAttachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  View Invoice
                </a>
              </div>
            )}
          </div>

          {/* Claim Action Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Claim Actions
            </h3>
            <div className="space-y-3">
              {/* Approval Actions - Admin Only */}
              {user?.role === "admin" && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Approval Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setConfirmModal({
                          show: true,
                          type: "claim-approval",
                          id: claimData.claim.id,
                          currentValue: claimData.claim.isApproved,
                          title: "Approve Claim?",
                          message:
                            "Are you sure you want to approve this claim?",
                        })
                      }
                      disabled={claimData.claim.isApproved}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        claimData.claim.isApproved
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-not-allowed opacity-60"
                          : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {claimData.claim.isApproved ? "Approved" : "Approve"}
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          show: true,
                          type: "claim-approval",
                          id: claimData.claim.id,
                          currentValue: claimData.claim.isApproved,
                          title: "Unapprove Claim?",
                          message:
                            "Are you sure you want to mark this claim as not approved?",
                        })
                      }
                      disabled={!claimData.claim.isApproved}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        !claimData.claim.isApproved
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed opacity-60"
                          : "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {!claimData.claim.isApproved
                        ? "Not Approved"
                        : "Unapprove"}
                    </button>
                  </div>
                </div>
              )}

              {/* Status Actions */}
              {/* User only */}
              {user?.role === "shop_admin" && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Claim Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setConfirmModal({
                          show: true,
                          type: "claim-status",
                          id: claimData.claim.id,
                          currentValue:
                            claimData.claim.status.toLowerCase() === "open",
                          title: "Open Claim?",
                          message: "Are you sure you want to open this claim?",
                        })
                      }
                      disabled={claimData.claim.status.toLowerCase() === "open"}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        claimData.claim.status.toLowerCase() === "open"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-not-allowed opacity-60"
                          : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                      {claimData.claim.status === "open" ? "Open" : "Open"}
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          show: true,
                          type: "claim-status",
                          id: claimData.claim.id,
                          currentValue:
                            claimData.claim.status.toLowerCase() === "open",
                          title: "Close Claim?",
                          message: "Are you sure you want to close this claim?",
                        })
                      }
                      disabled={
                        claimData.claim.status.toLowerCase() === "closed"
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        claimData.claim.status.toLowerCase() === "closed"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed opacity-60"
                          : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                      {claimData.claim.status === "closed" ? "Closed" : "Close"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Client Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Customer Name
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.clientName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Phone Number
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.clientContact}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.clientEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vehicle Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Plate Number
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.carPlateNo}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Chassis Number
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.carChassisNo}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Brand
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.carBrand}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Model
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.carModel}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Colour
              </label>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {claimData.claim.carColour}
              </p>
            </div>
          </div>
        </div>

        {/* Claimed Parts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Claimed Parts ({claimData.parts.length})
          </h2>
          <div className="space-y-6">
            {claimData.parts.map((part) => (
              <div
                key={part.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                {/* Part Information */}
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base text-gray-900 dark:text-white mb-2 wrap-break-word">
                        {part.carPartName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 wrap-break-word">
                        {part.brandName} - {part.typeName} - {part.seriesName} -{" "}
                        {part.productName}
                      </p>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <span className="text-gray-500 dark:text-gray-500 break-all">
                          Serial: {part.filmSerialNumber}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">
                          •
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">
                          Warranty: {part.warrantyInMonths} months
                        </span>
                      </div>
                    </div>
                    {part.installationImageUrl && (
                      <img
                        src={part.installationImageUrl}
                        alt="Installation"
                        onClick={() =>
                          setEnlargedImage(part.installationImageUrl!)
                        }
                        className="h-24 w-24 shrink-0 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80 transition-opacity self-start"
                      />
                    )}
                  </div>

                  {/* Status Badges - Stack on mobile */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
                        Approval:
                      </span>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          part.isApproved
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {part.isApproved ? "Approved" : "Not Approved"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
                        Status:
                      </span>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          part.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : part.status === "rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {part.status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Damaged Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Damaged Image
                    </label>
                    <div className="relative h-48 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                      <img
                        src={part.damagedImageUrl}
                        alt="Damaged"
                        onClick={() => setEnlargedImage(part.damagedImageUrl)}
                        className="h-full w-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </div>
                  </div>

                  {/* Resolution Image */}
                  {part.resolutionImageUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Resolution Image
                      </label>
                      <div className="relative h-48 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                        <img
                          src={part.resolutionImageUrl}
                          alt="Resolution"
                          onClick={() =>
                            setEnlargedImage(part.resolutionImageUrl!)
                          }
                          className="h-full w-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                {(part.remarks || part.resolutionDate) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mb-4">
                    {part.resolutionDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Resolution Date
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {new Date(part.resolutionDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {part.remarks && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                          Remarks
                        </label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                          {part.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Part Action Buttons */}
                {(user?.role === "admin" || user?.role === "shop_admin") && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Part Actions
                    </h4>
                    <div className="space-y-2">
                      {/* Approval Actions - Admin Only */}
                      {user?.role === "admin" && (
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                            Approval
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  show: true,
                                  type: "part-approval",
                                  id: part.id,
                                  currentValue: part.isApproved,
                                  title: "Approve Part?",
                                  message: `Are you sure you want to approve "${part.carPartName}"?`,
                                })
                              }
                              disabled={part.isApproved}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                part.isApproved
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-not-allowed opacity-60"
                                  : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                              }`}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {part.isApproved ? "Approved" : "Approve"}
                            </button>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  show: true,
                                  type: "part-approval",
                                  id: part.id,
                                  currentValue: part.isApproved,
                                  title: "Unapprove Part?",
                                  message: `Are you sure you want to mark "${part.carPartName}" as not approved?`,
                                })
                              }
                              disabled={!part.isApproved}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                !part.isApproved
                                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed opacity-60"
                                  : "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                              }`}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {!part.isApproved ? "Not Approved" : "Unapprove"}
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Status Actions - User Only */}
                      {user?.role === "shop_admin" && (
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                            Status
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  show: true,
                                  type: "part-status",
                                  id: part.id,
                                  currentValue:
                                    part.status.toLowerCase() === "open",
                                  title: "Open Part?",
                                  message: `Are you sure you want to open "${part.carPartName}"?`,
                                })
                              }
                              disabled={part.status.toLowerCase() === "open"}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                part.status.toLowerCase() === "open"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 cursor-not-allowed opacity-60"
                                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                              }`}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                              </svg>
                              {part.status === "open" ? "Open" : "Open"}
                            </button>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  show: true,
                                  type: "part-status",
                                  id: part.id,
                                  currentValue:
                                    part.status.toLowerCase() === "open",
                                  title: "Close Part?",
                                  message: `Are you sure you want to close "${part.carPartName}"?`,
                                })
                              }
                              disabled={part.status.toLowerCase() !== "open"}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                part.status.toLowerCase() !== "open"
                                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed opacity-60"
                                  : "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                              }`}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                              </svg>
                              {part.status !== "open" ? "Closed" : "Close"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push(`/admin/claims/edit/${params.id}`)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Edit Claim
          </button>
        </div>
      </div>
    </>
  );
}
