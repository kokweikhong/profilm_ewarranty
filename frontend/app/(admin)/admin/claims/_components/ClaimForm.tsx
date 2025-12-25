"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import {
  Claim,
  CreateClaimRequest,
  UpdateClaimRequest,
  WarrantySearchResult,
  WarrantyPart,
  ClaimWarrantyPart,
} from "@/types/claimsType";
import { camelToNormalCase } from "@/lib/utils";
import {
  searchWarrantiesApi,
  getWarrantyPartsApi,
} from "@/lib/apis/warrantiesApi";
import { createClaimAction, updateClaimAction } from "@/actions/claimsAction";

type Props = {
  claim?: Claim | null;
  mode?: "create" | "update";
};

export default function ClaimForm({ claim, mode = "create" }: Props) {
  const isEditMode = mode === "update" && claim;
  const router = useRouter();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WarrantySearchResult[]>(
    []
  );
  const [selectedWarranty, setSelectedWarranty] =
    useState<WarrantySearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Warranty parts state
  const [warrantyParts, setWarrantyParts] = useState<WarrantyPart[]>([]);
  const [loadingParts, setLoadingParts] = useState(false);
  const [selectedParts, setSelectedParts] = useState<
    Map<number, ClaimWarrantyPart>
  >(new Map());
  const [uploadingImages, setUploadingImages] = useState<
    Map<number, { damaged: boolean; resolution: boolean }>
  >(new Map());
  const [imagePreviews, setImagePreviews] = useState<
    Map<number, { damaged?: string; resolution?: string }>
  >(new Map());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateClaimRequest | UpdateClaimRequest>({
    defaultValues: isEditMode
      ? {
          id: claim.id,
          warrantyId: claim.warrantyId,
          claimNo: claim.claimNo,
          claimDate: claim.claimDate,
          isApproved: claim.isApproved,
          warrantyParts: [],
        }
      : {
          warrantyParts: [],
        },
  });

  // Search warranties by warranty number or car plate number
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast("Please enter a warranty number or car plate number", "error");
      return;
    }

    setIsSearching(true);
    setShowResults(false);

    try {
      const results = await searchWarrantiesApi(searchQuery);
      console.log("Search results:", results);
      setSearchResults(results);
      setShowResults(true);

      if (results.length === 0) {
        showToast("No warranties found", "error");
      }
    } catch (error) {
      console.error("Search error:", error);
      showToast("Failed to search warranties", "error");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select a warranty from search results
  const handleSelectWarranty = async (warranty: WarrantySearchResult) => {
    setSelectedWarranty(warranty);
    setValue("warrantyId", warranty.warrantyId);
    setShowResults(false);
    setSearchQuery(`${warranty.warrantyNo} - ${warranty.carPlateNo}`);

    // Load warranty parts
    await loadWarrantyParts(warranty.warrantyId);
  };

  // Load warranty parts for selected warranty
  const loadWarrantyParts = async (warrantyId: number) => {
    setLoadingParts(true);
    try {
      const parts = await getWarrantyPartsApi(warrantyId);
      setWarrantyParts(parts);
      if (parts.length === 0) {
        showToast("No warranty parts found for this warranty", "error");
      }
    } catch (error) {
      console.error("Error loading warranty parts:", error);
      showToast("Failed to load warranty parts", "error");
      setWarrantyParts([]);
    } finally {
      setLoadingParts(false);
    }
  };

  // Toggle warranty part selection
  const togglePartSelection = (part: WarrantyPart) => {
    const newSelectedParts = new Map(selectedParts);

    if (newSelectedParts.has(part.id)) {
      newSelectedParts.delete(part.id);

      // Clean up image previews
      const newPreviews = new Map(imagePreviews);
      newPreviews.delete(part.id);
      setImagePreviews(newPreviews);
    } else {
      newSelectedParts.set(part.id, {
        warrantyPartId: part.id,
        carPartName: part.carPartName,
        damagedImageUrl: "",
        remarks: "",
        resolutionDate: "",
        resolutionImageUrl: "",
      });
    }

    setSelectedParts(newSelectedParts);
  };

  // Update warranty part field
  const updatePartField = (
    partId: number,
    field: keyof ClaimWarrantyPart,
    value: string
  ) => {
    const newSelectedParts = new Map(selectedParts);
    const part = newSelectedParts.get(partId);

    if (part) {
      newSelectedParts.set(partId, {
        ...part,
        [field]: value,
      });
      setSelectedParts(newSelectedParts);
    }
  };

  // Handle image upload
  const handleImageUpload = async (
    partId: number,
    type: "damaged" | "resolution",
    file: File
  ) => {
    if (!file) return;

    // Update uploading state
    const newUploadingState = new Map(uploadingImages);
    const currentState = newUploadingState.get(partId) || {
      damaged: false,
      resolution: false,
    };
    newUploadingState.set(partId, {
      ...currentState,
      [type]: true,
    });
    setUploadingImages(newUploadingState);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = new Map(imagePreviews);
        const currentPreviews = newPreviews.get(partId) || {};
        newPreviews.set(partId, {
          ...currentPreviews,
          [type]: reader.result as string,
        });
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.url || data.path || "";

      // Update part with image URL
      const field =
        type === "damaged" ? "damagedImageUrl" : "resolutionImageUrl";
      updatePartField(partId, field, imageUrl);

      showToast("Image uploaded successfully", "success");
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Failed to upload image", "error");
    } finally {
      // Clear uploading state
      const newUploadingState = new Map(uploadingImages);
      const currentState = newUploadingState.get(partId);
      if (currentState) {
        newUploadingState.set(partId, {
          ...currentState,
          [type]: false,
        });
      }
      setUploadingImages(newUploadingState);
    }
  };

  const onSubmit: SubmitHandler<
    CreateClaimRequest | UpdateClaimRequest
  > = async (data) => {
    if (!selectedWarranty && !isEditMode) {
      showToast("Please select a warranty", "error");
      return;
    }

    if (selectedParts.size === 0) {
      showToast("Please select at least one warranty part", "error");
      return;
    }

    // Validate all selected parts have required fields
    const partsArray = Array.from(selectedParts.values());
    const invalidParts = partsArray.filter(
      (part) =>
        !part.damagedImageUrl ||
        !part.resolutionDate ||
        !part.resolutionImageUrl
    );

    if (invalidParts.length > 0) {
      showToast(
        "Please fill in all required fields for selected parts",
        "error"
      );
      return;
    }

    try {
      let result;

      const submissionData = {
        ...data,
        warrantyParts: partsArray,
      };

      if (isEditMode) {
        result = await updateClaimAction(submissionData as UpdateClaimRequest);
      } else {
        result = await createClaimAction(submissionData as CreateClaimRequest);
      }

      if (result.success) {
        showToast(
          `Claim ${isEditMode ? "updated" : "created"} successfully!`,
          "success"
        );
        setTimeout(() => {
          router.push("/admin/claims");
        }, 500);
      } else {
        showToast(result.error || "Failed to submit claim", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to submit claim", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Update Claim" : "Create New Claim"}
      </h2>

      {/* Warranty Search Section */}
      {!isEditMode && (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Search Warranty</h3>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter warranty number or car plate number"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                disabled={isSearching}
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Selected Warranty Display */}
          {selectedWarranty && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-primary">
                    Selected Warranty
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Warranty No:</span>{" "}
                    {selectedWarranty.warrantyNo}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Car Plate:</span>{" "}
                    {selectedWarranty.carPlateNo}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Client:</span>{" "}
                    {selectedWarranty.clientName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Car:</span>{" "}
                    {selectedWarranty.carBrand} {selectedWarranty.carModel}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWarranty(null);
                    setValue("warrantyId", 0);
                    setSearchQuery("");
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="mt-4 border border-gray-300 dark:border-gray-600 rounded-md max-h-96 overflow-y-auto">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 font-semibold text-sm">
                {searchResults.length} result(s) found
              </div>
              {searchResults.map((warranty) => (
                <div
                  key={warranty.warrantyId}
                  onClick={() => handleSelectWarranty(warranty)}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Warranty No:</span>{" "}
                      {warranty.warrantyNo}
                    </div>
                    <div>
                      <span className="font-medium">Car Plate:</span>{" "}
                      {warranty.carPlateNo}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span>{" "}
                      {warranty.clientName}
                    </div>
                    <div>
                      <span className="font-medium">Contact:</span>{" "}
                      {warranty.clientContact}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Car:</span>{" "}
                      {warranty.carBrand} {warranty.carModel}
                    </div>
                    <div>
                      <span className="font-medium">Shop:</span>{" "}
                      {warranty.shopName}
                    </div>
                    <div>
                      <span className="font-medium">Branch:</span>{" "}
                      {warranty.branchCode}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Warranty Parts Section */}
      {selectedWarranty && (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Warranty Parts</h3>

          {loadingParts ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Loading warranty parts...
            </p>
          ) : warrantyParts.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No warranty parts available
            </p>
          ) : (
            <div className="space-y-6">
              {warrantyParts.map((part) => {
                const isSelected = selectedParts.has(part.id);
                const partData = selectedParts.get(part.id);
                const uploadingState = uploadingImages.get(part.id);
                const previews = imagePreviews.get(part.id);

                return (
                  <div
                    key={part.id}
                    className={`p-4 border rounded-lg ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`part-${part.id}`}
                        checked={isSelected}
                        onChange={() => togglePartSelection(part)}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`part-${part.id}`}
                          className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                        >
                          {part.carPartName}
                        </label>

                        {isSelected && partData && (
                          <div className="mt-4 space-y-4">
                            {/* Damaged Image Upload */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Damaged Image *
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      handleImageUpload(
                                        part.id,
                                        "damaged",
                                        file
                                      );
                                  }}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                  disabled={uploadingState?.damaged}
                                />
                              </div>
                              {uploadingState?.damaged && (
                                <p className="text-sm text-primary mt-1">
                                  Uploading...
                                </p>
                              )}
                              {previews?.damaged && (
                                <div className="mt-2">
                                  <img
                                    src={previews.damaged}
                                    alt="Damaged preview"
                                    className="h-32 w-auto object-cover rounded"
                                  />
                                </div>
                              )}
                              <input
                                type="text"
                                value={partData.damagedImageUrl}
                                onChange={(e) =>
                                  updatePartField(
                                    part.id,
                                    "damagedImageUrl",
                                    e.target.value
                                  )
                                }
                                placeholder="Or paste image URL"
                                className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            {/* Resolution Date */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Resolution Date *
                              </label>
                              <input
                                type="date"
                                value={partData.resolutionDate}
                                onChange={(e) =>
                                  updatePartField(
                                    part.id,
                                    "resolutionDate",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            {/* Resolution Image Upload */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Resolution Image *
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      handleImageUpload(
                                        part.id,
                                        "resolution",
                                        file
                                      );
                                  }}
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                  disabled={uploadingState?.resolution}
                                />
                              </div>
                              {uploadingState?.resolution && (
                                <p className="text-sm text-primary mt-1">
                                  Uploading...
                                </p>
                              )}
                              {previews?.resolution && (
                                <div className="mt-2">
                                  <img
                                    src={previews.resolution}
                                    alt="Resolution preview"
                                    className="h-32 w-auto object-cover rounded"
                                  />
                                </div>
                              )}
                              <input
                                type="text"
                                value={partData.resolutionImageUrl}
                                onChange={(e) =>
                                  updatePartField(
                                    part.id,
                                    "resolutionImageUrl",
                                    e.target.value
                                  )
                                }
                                placeholder="Or paste image URL"
                                className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                              />
                            </div>

                            {/* Remarks */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Remarks (Optional)
                              </label>
                              <textarea
                                value={partData.remarks || ""}
                                onChange={(e) =>
                                  updatePartField(
                                    part.id,
                                    "remarks",
                                    e.target.value
                                  )
                                }
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                                placeholder="Enter any additional remarks"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Claim Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Claim Number */}
        <div>
          <label
            htmlFor="claimNo"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Claim Number *
          </label>
          <input
            type="text"
            id="claimNo"
            {...register("claimNo", {
              required: "Claim number is required",
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            placeholder="Enter claim number"
          />
          {errors.claimNo && (
            <p className="mt-1 text-sm text-red-600">
              {errors.claimNo.message}
            </p>
          )}
        </div>

        {/* Claim Date */}
        <div>
          <label
            htmlFor="claimDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Claim Date *
          </label>
          <input
            type="date"
            id="claimDate"
            {...register("claimDate", {
              required: "Claim date is required",
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
          />
          {errors.claimDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.claimDate.message}
            </p>
          )}
        </div>

        {/* Is Approved (Update mode only) */}
        {isEditMode && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isApproved"
              {...register("isApproved")}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="isApproved"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Approved
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isEditMode && !selectedWarranty}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? "Update Claim" : "Create Claim"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/claims")}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
