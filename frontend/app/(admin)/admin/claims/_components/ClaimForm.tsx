"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import {
  WarrantyPartDetails,
  WarrantyWithPartsResponse,
} from "@/types/warrantiesType";

import {
  Claim,
  CreateClaimWithPartsRequest,
  CreateClaimWarrantyPartRequest,
  UpdateClaimWithPartsRequest,
  UpdateClaimWarrantyPartRequest,
  ClaimWithPartsDetailResponse,
  ClaimView,
} from "@/types/claimsType";
import { createClaimAction, updateClaimAction } from "@/actions/claimsAction";
import { uploadFile } from "@/lib/apis/uploadsApi";
import { generateNextClaimNoApi } from "@/lib/apis/claimsApi";
import WarrantyInformation from "./WarrantyInformation";

type Props =
  | {
      claimData: ClaimWithPartsDetailResponse;
      warrantyParts?: WarrantyPartDetails[];
      onCancel: () => void;
      isEditMode: true;
    }
  | {
      claimData?: ClaimWithPartsDetailResponse;
      warrantyParts: WarrantyPartDetails[];
      onCancel: () => void;
      isEditMode?: false;
    };

interface ClaimFormData {
  claimNo: string;
  claimDate: string;
  claimParts: {
    id?: number;
    warrantyPartId: number;
    damagedImageUrl: string;
    status?: string;
    remarks: string;
    resolutionDate: string;
    resolutionImageUrl: string;
  }[];
}

export default function ClaimForm({
  claimData,
  warrantyParts,
  onCancel,
  isEditMode,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingClaimNo, setIsGeneratingClaimNo] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<ClaimFormData | null>(
    null
  );
  const [selectedParts, setSelectedParts] = useState<Set<number>>(
    new Set(
      Array.isArray(claimData?.parts)
        ? claimData.parts.map((p) => p.warrantyPartId)
        : []
    )
  );
  const [damagedImages, setDamagedImages] = useState<Map<number, File>>(
    new Map()
  );
  const [damagedPreviews, setDamagedPreviews] = useState<Map<number, string>>(
    new Map(
      Array.isArray(claimData?.parts)
        ? claimData.parts.map((p) => [p.warrantyPartId, p.damagedImageUrl])
        : []
    )
  );
  const [resolutionImages, setResolutionImages] = useState<Map<number, File>>(
    new Map()
  );
  const [resolutionPreviews, setResolutionPreviews] = useState<
    Map<number, string>
  >(
    new Map(
      Array.isArray(claimData?.parts)
        ? claimData.parts
            .filter((p) => p.resolutionImageUrl)
            .map((p) => [p.warrantyPartId, p.resolutionImageUrl!])
        : []
    )
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClaimFormData>({
    defaultValues: {
      claimNo: claimData?.claim.claimNo || "",
      claimDate: !isEditMode
        ? new Date().toISOString().split("T")[0]
        : new Date(claimData!.claim.claimDate).toISOString().split("T")[0],
      claimParts: Array.isArray(claimData?.parts)
        ? claimData.parts.map((part) => ({
            id: part.id,
            warrantyPartId: part.warrantyPartId,
            damagedImageUrl: part.damagedImageUrl,
            status: part.status,
            remarks: part.remarks || "",
            resolutionDate: part.resolutionDate || "",
            resolutionImageUrl: part.resolutionImageUrl || "",
          }))
        : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "claimParts",
  });

  // Watch claim date for auto-generation
  const claimDate = watch("claimDate");

  // Sync selected parts and form fields when claim data loads (for edit mode only, run once)
  useEffect(() => {
    if (
      isEditMode &&
      claimData &&
      Array.isArray(claimData.parts) &&
      claimData.parts.length > 0 &&
      selectedParts.size === 0 // Only run if not already initialized
    ) {
      // Update selected parts
      const partIds = new Set(claimData.parts.map((p) => p.warrantyPartId));
      setSelectedParts(partIds);

      // Update form fields if they're empty (data loaded after form initialization)
      if (fields.length === 0) {
        claimData.parts.forEach((part) => {
          append({
            id: part.id,
            warrantyPartId: part.warrantyPartId,
            damagedImageUrl: part.damagedImageUrl,
            status: part.status,
            remarks: part.remarks || "",
            resolutionDate: part.resolutionDate || "",
            resolutionImageUrl: part.resolutionImageUrl || "",
          });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, claimData]);

  // Format date to yyyymmdd
  const formatDateToYYYYMMDD = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  // Auto-generate claim number when date changes (only in create mode)
  useEffect(() => {
    const generateClaimNo = async () => {
      if (isEditMode || !claimDate || !claimData?.claim.warrantyNo) return;

      try {
        setIsGeneratingClaimNo(true);
        const formattedDate = formatDateToYYYYMMDD(claimDate);
        const result = await generateNextClaimNoApi(
          claimData?.claim.warrantyNo,
          formattedDate
        );
        setValue("claimNo", result.claimNo);
      } catch (error) {
        console.error("Error generating claim number:", error);
        showToast("Failed to generate claim number", "error");
      } finally {
        setIsGeneratingClaimNo(false);
      }
    };

    generateClaimNo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimDate, claimData?.claim.warrantyNo]);

  // Toggle part selection
  const togglePart = (partId: number) => {
    if (isEditMode) return; // Disable toggling in edit mode
    console.log("togglePart called with partId:", partId);
    console.log("Current selectedParts:", Array.from(selectedParts));

    const newSelected = new Set(selectedParts);
    if (newSelected.has(partId)) {
      console.log("Removing part:", partId);
      newSelected.delete(partId);
      // Remove from form array
      const index = fields.findIndex((f) => f.warrantyPartId === partId);
      if (index !== -1) remove(index);
    } else {
      console.log("Adding part:", partId);
      newSelected.add(partId);
      // Check if this part exists in existing data
      const existingPart = Array.isArray(claimData?.parts)
        ? claimData.parts.find((p) => p.warrantyPartId === partId)
        : undefined;
      console.log("Existing part found:", existingPart);
      // Add to form array
      append({
        id: existingPart?.id,
        warrantyPartId: partId,
        damagedImageUrl: existingPart?.damagedImageUrl || "",
        status: existingPart?.status || "pending",
        remarks: existingPart?.remarks || "",
        resolutionDate: existingPart?.resolutionDate || "",
        resolutionImageUrl: existingPart?.resolutionImageUrl || "",
      });
    }
    console.log("New selectedParts:", Array.from(newSelected));
    setSelectedParts(newSelected);
  };

  // Handle damaged image selection
  const handleDamagedImageSelect = (partId: number, file: File) => {
    console.log(
      "handleDamagedImageSelect called with partId:",
      partId,
      "file:",
      file.name
    );
    setDamagedImages((prev) => new Map(prev).set(partId, file));

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("Image loaded for partId:", partId);
      setDamagedPreviews((prev) =>
        new Map(prev).set(partId, reader.result as string)
      );
    };
    reader.readAsDataURL(file);
  };

  // Handle resolution image selection
  const handleResolutionImageSelect = (partId: number, file: File) => {
    setResolutionImages((prev) => new Map(prev).set(partId, file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setResolutionPreviews((prev) =>
        new Map(prev).set(partId, reader.result as string)
      );
    };
    reader.readAsDataURL(file);
  };

  // Upload all images
  const uploadAllImages = async () => {
    const uploadedDamagedUrls = new Map<number, string>();
    const uploadedResolutionUrls = new Map<number, string>();

    // Upload damaged images
    for (const [partId, file] of damagedImages.entries()) {
      const url = await uploadFile(file, "claims/damaged");
      uploadedDamagedUrls.set(partId, url);
    }

    // Upload resolution images
    for (const [partId, file] of resolutionImages.entries()) {
      const url = await uploadFile(file, "claims/resolution");
      uploadedResolutionUrls.set(partId, url);
    }

    return { uploadedDamagedUrls, uploadedResolutionUrls };
  };

  // Handle form submission - show confirmation modal
  const handleFormSubmit = (data: ClaimFormData) => {
    // Validate that at least one part is selected
    if (data.claimParts.length === 0) {
      showToast("Please select at least one warranty part", "error");
      return;
    }

    // Validate that all selected parts have damaged images (new images or existing URLs)
    for (const part of data.claimParts) {
      if (!damagedImages.has(part.warrantyPartId) && !part.damagedImageUrl) {
        showToast("All selected parts must have damaged images", "error");
        return;
      }
    }

    // Show confirmation modal
    setPendingFormData(data);
    setShowConfirmModal(true);
  };

  // Confirm and submit form
  const confirmSubmit = async () => {
    if (!pendingFormData) return;

    const data = pendingFormData;
    setShowConfirmModal(false);

    try {
      setIsSubmitting(true);

      // Validate again
      if (data.claimParts.length === 0) {
        showToast("Please select at least one warranty part", "error");
        return;
      }

      for (const part of data.claimParts) {
        if (!damagedImages.has(part.warrantyPartId) && !part.damagedImageUrl) {
          showToast("All selected parts must have damaged images", "error");
          return;
        }
      }

      // Upload all images
      const { uploadedDamagedUrls, uploadedResolutionUrls } =
        await uploadAllImages();

      if (isEditMode && claimData) {
        // Update mode
        const parts: UpdateClaimWarrantyPartRequest[] = data.claimParts.map(
          (part) => ({
            id: part.id!,
            warrantyPartId: part.warrantyPartId,
            damagedImageUrl:
              uploadedDamagedUrls.get(part.warrantyPartId) ||
              part.damagedImageUrl,
            status: part.status || "pending",
            remarks: part.remarks || "",
            resolutionDate: part.resolutionDate || "",
            resolutionImageUrl:
              uploadedResolutionUrls.get(part.warrantyPartId) ||
              part.resolutionImageUrl ||
              "",
          })
        );

        const updateRequest: UpdateClaimWithPartsRequest = {
          claim: {
            id: claimData.claim.id,
            warrantyId: claimData?.claim.warrantyId || 0,
            claimNo: data.claimNo,
            claimDate: data.claimDate,
          },
          parts,
        };

        const result = await updateClaimAction(updateRequest);

        if (result.success) {
          showToast("Claim updated successfully!", "success");
          setTimeout(() => {
            router.push("/admin/claims");
          }, 500);
        } else {
          showToast(`Error: ${result.error}`, "error");
        }
      } else {
        // Create mode
        const parts: CreateClaimWarrantyPartRequest[] = data.claimParts.map(
          (part) => ({
            claimId: 0, // Will be set by backend
            warrantyPartId: part.warrantyPartId,
            damagedImageUrl: uploadedDamagedUrls.get(part.warrantyPartId) || "",
            remarks: part.remarks || "",
            resolutionDate: part.resolutionDate || "",
            resolutionImageUrl:
              uploadedResolutionUrls.get(part.warrantyPartId) || "",
          })
        );

        const createRequest: CreateClaimWithPartsRequest = {
          claim: {
            warrantyId: claimData?.claim.warrantyId || 0,
            claimNo: data.claimNo,
            claimDate: data.claimDate,
          },
          parts,
        };

        const result = await createClaimAction(createRequest);

        if (result.success) {
          showToast("Claim created successfully!", "success");
          setTimeout(() => {
            router.push("/admin/claims");
          }, 500);
        } else {
          showToast(`Error: ${result.error}`, "error");
        }
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} claim:`,
        error
      );
      showToast(
        `Failed to ${isEditMode ? "update" : "create"} claim: ${
          error.message || "Unknown error"
        }`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isEditMode ? "Confirm Update" : "Confirm Submission"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isEditMode
                  ? "Are you sure you want to update this claim? This action will save all changes."
                  : "Are you sure you want to create this claim? Please review all information before submitting."}
              </p>
              {pendingFormData && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Summary:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Claim No: {pendingFormData.claimNo}</li>
                    <li>• Claim Date: {pendingFormData.claimDate}</li>
                    <li>
                      • Selected Parts: {pendingFormData.claimParts.length}
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingFormData(null);
                }}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Warranty information */}
        <WarrantyInformation claimData={claimData!.claim} onCancel={onCancel} />

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-4 sm:p-6 space-y-6"
        >
          {/* Claim Details */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {isEditMode ? "Edit Claim Details" : "Claim Details"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Claim Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("claimNo", {
                      required: "Claim number is required",
                    })}
                    type="text"
                    readOnly={!isEditMode}
                    disabled={isGeneratingClaimNo && !isEditMode}
                    className={`block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      isEditMode
                        ? "bg-white dark:bg-gray-700"
                        : "bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                    }`}
                    placeholder={
                      isGeneratingClaimNo
                        ? "Generating..."
                        : isEditMode
                        ? "Enter claim number"
                        : "Auto-generated"
                    }
                  />
                  {isGeneratingClaimNo && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                {errors.claimNo && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.claimNo.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Claim Date <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("claimDate", {
                    required: "Claim date is required",
                  })}
                  type="date"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
                {errors.claimDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.claimDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Warranty Parts Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Select Warranty Parts to Claim
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Select the parts you want to claim and provide damage
                information
              </p>
            </div>

            <div className="space-y-4">
              {(isEditMode ? claimData?.parts : warrantyParts)?.map((part) => {
                // In edit mode, part.warrantyPartId is the warranty part ID
                // In create mode, part.id is the warranty part ID
                const partId =
                  isEditMode && "warrantyPartId" in part
                    ? part.warrantyPartId
                    : part.id;

                console.log("Rendering part:", {
                  isEditMode,
                  partId,
                  hasWarrantyPartId: "warrantyPartId" in part,
                  part,
                });

                const isSelected = selectedParts.has(partId);
                const fieldIndex = fields.findIndex(
                  (f) => f.warrantyPartId === partId
                );

                console.log("Part selection state:", {
                  partId,
                  isSelected,
                  fieldIndex,
                  selectedPartsArray: Array.from(selectedParts),
                });

                return (
                  <div
                    key={part.id}
                    className={`border rounded-lg p-3 sm:p-4 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          togglePart(partId);
                        }}
                        title={`Select ${part.carPartName} for claim`}
                        disabled={isEditMode}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-medium text-sm sm:text-base text-gray-900 dark:text-white wrap-break-word cursor-pointer hover:text-primary transition-colors"
                              onClick={() => togglePart(partId)}
                            >
                              {part.carPartName}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 wrap-break-word mt-1">
                              {"brandName" in part
                                ? `${part.brandName} - ${part.typeName} - ${part.seriesName} - ${part.productName}`
                                : `${part.productBrand} - ${part.productType} - ${part.productSeries} - ${part.productName}`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 break-all">
                              Warranty: {part.warrantyInMonths} months | Serial:{" "}
                              {part.filmSerialNumber}
                            </p>
                          </div>
                          {part.installationImageUrl && (
                            <img
                              src={part.installationImageUrl}
                              alt="Installation"
                              onClick={() =>
                                setEnlargedImage(part.installationImageUrl!)
                              }
                              className="h-20 w-20 sm:h-16 sm:w-16 shrink-0 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          )}
                        </div>

                        {isSelected && fieldIndex !== -1 && (
                          <div className="mt-4 space-y-4 border-t pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Damaged Image */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Damaged Image{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <div className="relative h-40 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary transition-colors overflow-hidden group">
                                  <input
                                    key={`damaged-${partId}-${
                                      damagedPreviews.get(partId) || "new"
                                    }`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file)
                                        handleDamagedImageSelect(partId, file);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  {damagedPreviews.has(partId) ? (
                                    <>
                                      <img
                                        src={damagedPreviews.get(partId)}
                                        alt="Damaged preview"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEnlargedImage(
                                            damagedPreviews.get(partId)!
                                          );
                                        }}
                                        className="h-full w-full object-contain cursor-pointer"
                                      />
                                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center pointer-events-none">
                                        <span className="text-white text-sm font-medium">
                                          Click to enlarge or change
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                      <svg
                                        className="h-8 w-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                      </svg>
                                      <span className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">
                                        Click to upload damaged image
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Resolution Image */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Resolution Image (Optional)
                                </label>
                                <div className="relative h-40 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary transition-colors overflow-hidden group">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file)
                                        handleResolutionImageSelect(
                                          partId,
                                          file
                                        );
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  {resolutionPreviews.has(partId) ? (
                                    <>
                                      <img
                                        src={resolutionPreviews.get(partId)}
                                        alt="Resolution preview"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEnlargedImage(
                                            resolutionPreviews.get(partId)!
                                          );
                                        }}
                                        className="h-full w-full object-contain cursor-pointer"
                                      />
                                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center pointer-events-none">
                                        <span className="text-white text-sm font-medium">
                                          Click to enlarge or change
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                      <svg
                                        className="h-8 w-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                      </svg>
                                      <span className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">
                                        Click to upload resolution image
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Resolution Date */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Resolution Date (Optional)
                              </label>
                              <input
                                {...register(
                                  `claimParts.${fieldIndex}.resolutionDate`
                                )}
                                type="date"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                              />
                            </div>

                            {/* Remarks */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Remarks (Optional)
                              </label>
                              <textarea
                                {...register(
                                  `claimParts.${fieldIndex}.remarks`
                                )}
                                rows={3}
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                                placeholder="Additional notes about the damage or resolution..."
                              />
                            </div>

                            <input
                              type="hidden"
                              {...register(
                                `claimParts.${fieldIndex}.warrantyPartId`
                              )}
                              value={partId}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(isEditMode ? claimData?.parts : warrantyParts)?.length === 0 && (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">
                No warranty parts available for this warranty.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedParts.size === 0}
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating Claim..."
                  : "Creating Claim..."
                : isEditMode
                ? "Update Claim"
                : "Create Claim"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
