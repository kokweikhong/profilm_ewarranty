"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useToast } from "@/contexts/ToastContext";
import { WarrantyWithPartsResponse } from "@/types/warrantiesType";
import { ClaimWarrantyPart } from "@/types/claimsType";
import { createClaimAction } from "@/actions/claimsAction";
import { uploadFile } from "@/lib/apis/uploadsApi";
import { generateNextClaimNoApi } from "@/lib/apis/claimsApi";

type Props = {
  warrantyData: WarrantyWithPartsResponse;
  onCancel: () => void;
};

interface ClaimFormData {
  claimNo: string;
  claimDate: string;
  claimParts: {
    warrantyPartId: number;
    damagedImageUrl: string;
    remarks: string;
    resolutionDate: string;
    resolutionImageUrl: string;
  }[];
}

export default function ClaimForm({ warrantyData, onCancel }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingClaimNo, setIsGeneratingClaimNo] = useState(false);
  const [selectedParts, setSelectedParts] = useState<Set<number>>(new Set());
  const [damagedImages, setDamagedImages] = useState<Map<number, File>>(
    new Map()
  );
  const [damagedPreviews, setDamagedPreviews] = useState<Map<number, string>>(
    new Map()
  );
  const [resolutionImages, setResolutionImages] = useState<Map<number, File>>(
    new Map()
  );
  const [resolutionPreviews, setResolutionPreviews] = useState<
    Map<number, string>
  >(new Map());

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClaimFormData>({
    defaultValues: {
      claimNo: "",
      claimDate: new Date().toISOString().split("T")[0],
      claimParts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "claimParts",
  });

  // Watch claim date for auto-generation
  const claimDate = watch("claimDate");

  // Format date to yyyymmdd
  const formatDateToYYYYMMDD = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  // Auto-generate claim number when date changes
  useEffect(() => {
    const generateClaimNo = async () => {
      if (!claimDate || !warrantyData.warranty.warrantyNo) return;

      try {
        setIsGeneratingClaimNo(true);
        const formattedDate = formatDateToYYYYMMDD(claimDate);
        const result = await generateNextClaimNoApi(
          warrantyData.warranty.warrantyNo,
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
  }, [claimDate, warrantyData.warranty.warrantyNo]);

  // Toggle part selection
  const togglePart = (partId: number) => {
    const newSelected = new Set(selectedParts);
    if (newSelected.has(partId)) {
      newSelected.delete(partId);
      // Remove from form array
      const index = fields.findIndex((f) => f.warrantyPartId === partId);
      if (index !== -1) remove(index);
    } else {
      newSelected.add(partId);
      // Add to form array
      append({
        warrantyPartId: partId,
        damagedImageUrl: "",
        remarks: "",
        resolutionDate: "",
        resolutionImageUrl: "",
      });
    }
    setSelectedParts(newSelected);
  };

  // Handle damaged image selection
  const handleDamagedImageSelect = (partId: number, file: File) => {
    setDamagedImages((prev) => new Map(prev).set(partId, file));

    const reader = new FileReader();
    reader.onloadend = () => {
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

  // Submit form
  const onSubmit = async (data: ClaimFormData) => {
    try {
      // Validate that at least one part is selected
      if (data.claimParts.length === 0) {
        showToast("Please select at least one warranty part", "error");
        return;
      }

      // Validate that all selected parts have damaged images
      for (const part of data.claimParts) {
        if (!damagedImages.has(part.warrantyPartId)) {
          showToast("All selected parts must have damaged images", "error");
          return;
        }
      }

      setIsSubmitting(true);

      // Upload all images
      const { uploadedDamagedUrls, uploadedResolutionUrls } =
        await uploadAllImages();

      // Prepare claim parts with uploaded image URLs
      const warrantyParts: ClaimWarrantyPart[] = data.claimParts.map(
        (part) => ({
          warrantyPartId: part.warrantyPartId,
          damagedImageUrl: uploadedDamagedUrls.get(part.warrantyPartId) || "",
          remarks: part.remarks || "",
          resolutionDate: part.resolutionDate || "",
          resolutionImageUrl:
            uploadedResolutionUrls.get(part.warrantyPartId) || "",
          carPartName: "", // This will be set by the backend
        })
      );

      // Create claim request
      const claimRequest = {
        warrantyId: warrantyData.warranty.id,
        claimNo: data.claimNo,
        claimDate: data.claimDate,
        warrantyParts: warrantyParts,
      };

      const result = await createClaimAction(claimRequest);

      if (result.success) {
        showToast("Claim created successfully!", "success");
        setTimeout(() => {
          router.push("/admin/claims");
        }, 500);
      } else {
        showToast(`Error: ${result.error}`, "error");
      }
    } catch (error: any) {
      console.error("Error creating claim:", error);
      showToast(
        `Failed to create claim: ${error.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Warranty Information Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Warranty Information
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white self-start sm:self-auto"
          >
            ← Change Warranty
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Warranty No:
            </span>
            <span className="sm:ml-2 text-gray-900 dark:text-white break-all">
              {warrantyData.warranty.warrantyNo}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Car Plate:
            </span>
            <span className="sm:ml-2 text-gray-900 dark:text-white break-all">
              {warrantyData.warranty.carPlateNo}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Client:
            </span>
            <span className="sm:ml-2 text-gray-900 dark:text-white wrap-break-word">
              {warrantyData.warranty.clientName}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Vehicle:
            </span>
            <span className="sm:ml-2 text-gray-900 dark:text-white wrap-break-word">
              {warrantyData.warranty.carBrand} {warrantyData.warranty.carModel}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6">
        {/* Claim Details */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Claim Details
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
                  readOnly
                  disabled={isGeneratingClaimNo}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors cursor-not-allowed"
                  placeholder={
                    isGeneratingClaimNo ? "Generating..." : "Auto-generated"
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
              Choose the parts you want to claim and provide damage information
            </p>
          </div>

          <div className="space-y-4">
            {warrantyData.parts.map((part) => {
              const isSelected = selectedParts.has(part.id);
              const fieldIndex = fields.findIndex(
                (f) => f.warrantyPartId === part.id
              );

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
                      onChange={() => togglePart(part.id)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white wrap-break-word">
                            {part.carPartName}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 wrap-break-word mt-1">
                            {part.productBrand} - {part.productType} -{" "}
                            {part.productSeries} - {part.productName}
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
                            className="h-20 w-20 sm:h-16 sm:w-16 shrink-0 object-cover rounded-lg shadow-sm"
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
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      handleDamagedImageSelect(part.id, file);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {damagedPreviews.has(part.id) ? (
                                  <>
                                    <img
                                      src={damagedPreviews.get(part.id)}
                                      alt="Damaged preview"
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center pointer-events-none">
                                      <span className="text-white text-sm font-medium">
                                        Change Image
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
                                        part.id,
                                        file
                                      );
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {resolutionPreviews.has(part.id) ? (
                                  <>
                                    <img
                                      src={resolutionPreviews.get(part.id)}
                                      alt="Resolution preview"
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center pointer-events-none">
                                      <span className="text-white text-sm font-medium">
                                        Change Image
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
                              {...register(`claimParts.${fieldIndex}.remarks`)}
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
                            value={part.id}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {warrantyData.parts.length === 0 && (
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
            {isSubmitting ? "Creating Claim..." : "Create Claim"}
          </button>
        </div>
      </form>
    </div>
  );
}
