"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import {
  CarPart,
  Warranty,
  CreateWarrantyPartRequest,
} from "@/types/warrantiesType";
import {
  CreateWarrantyRequest,
  UpdateWarrantyRequest,
} from "@/types/warrantiesType";
import {
  createWarrantyAction,
  updateWarrantyAction,
} from "@/actions/warrantiesAction";
import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import { camelToNormalCase } from "@/lib/utils";
import { getProductsFromAllocationByShopIdApi } from "@/lib/apis/productAllocationsApi";

type Props = {
  warranty?: Warranty | null;
  carParts: CarPart[];
  productsFromAllocation?: ProductsFromAllocationByShopIdResponse[];
  mode?: "create" | "update";
};

interface WarrantyPartData {
  carPartId: number;
  carPartName: string;
  productAllocationId: number;
  installationImageUrl: string;
}

export default function WarrantyForm({
  warranty,
  carParts,
  productsFromAllocation,
  mode = "create",
}: Props) {
  const isEditMode = mode === "update" && warranty;
  const router = useRouter();
  const { showToast } = useToast();

  // State for managing selected car parts with their details
  const [selectedCarParts, setSelectedCarParts] = useState<
    Map<number, WarrantyPartData>
  >(new Map());

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateWarrantyRequest>({
    defaultValues: isEditMode
      ? {
          shopId: warranty.shopId,
          clientName: warranty.clientName,
          clientContact: warranty.clientContact,
          clientEmail: warranty.clientEmail,
          carBrand: warranty.carBrand,
          carModel: warranty.carModel,
          carColour: warranty.carColour,
          carPlateNo: warranty.carPlateNo,
          carChassisNo: warranty.carChassisNo,
          installationDate: warranty.installationDate,
          referenceNo: warranty.referenceNo,
          warrantyNo: warranty.warrantyNo,
          invoiceAttachmentUrl: warranty.invoiceAttachmentUrl,
        }
      : {
          installationDate: new Date().toISOString().split("T")[0], // Default to today
        },
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<CreateWarrantyRequest | null>(null);
  const [warrantyParts, setWarrantyParts] = useState<
    CreateWarrantyPartRequest[]
  >([]);
  const [uploadingImages, setUploadingImages] = useState<Map<number, boolean>>(
    new Map()
  );
  const [imagePreview, setImagePreview] = useState<Map<number, string>>(
    new Map()
  );

  // Handle image upload
  const handleImageUpload = async (
    carPartId: number,
    file: File
  ): Promise<void> => {
    if (!file) return;

    // Set uploading state
    setUploadingImages((prev) => new Map(prev).set(carPartId, true));

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // TODO: Replace with your actual upload endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.url; // Adjust based on your API response structure

      // Update the car part with the image URL
      updateCarPartDetails(carPartId, "installationImageUrl", imageUrl);

      // Set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) =>
          new Map(prev).set(carPartId, reader.result as string)
        );
      };
      reader.readAsDataURL(file);

      showToast("Image uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Failed to upload image", "error");
    } finally {
      setUploadingImages((prev) => {
        const newMap = new Map(prev);
        newMap.set(carPartId, false);
        return newMap;
      });
    }
  };

  // Toggle car part selection
  const toggleCarPart = (carPartId: number, carPartName: string) => {
    const newSelected = new Map(selectedCarParts);
    if (newSelected.has(carPartId)) {
      newSelected.delete(carPartId);
    } else {
      newSelected.set(carPartId, {
        carPartId,
        carPartName,
        productAllocationId: 0,
        installationImageUrl: "",
      });
    }
    setSelectedCarParts(newSelected);
  };

  // Update car part details
  const updateCarPartDetails = (
    carPartId: number,
    field: "productAllocationId" | "installationImageUrl",
    value: number | string
  ) => {
    const newSelected = new Map(selectedCarParts);
    const existing = newSelected.get(carPartId);
    if (existing) {
      newSelected.set(carPartId, {
        ...existing,
        [field]: value,
      });
      setSelectedCarParts(newSelected);
    }
  };

  const onSubmit: SubmitHandler<CreateWarrantyRequest> = (data) => {
    // Generate warranty parts array from selected car parts
    const parts: CreateWarrantyPartRequest[] = Array.from(
      selectedCarParts.values()
    ).map((part) => ({
      warrantyId: 0, // Will be set by backend after warranty creation
      productAllocationId: part.productAllocationId,
      carPartId: part.carPartId,
      installationImageUrl: part.installationImageUrl,
    }));

    setFormData(data);
    setWarrantyParts(parts);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);

    if (formData) {
      // For create mode, send warranty data and parts
      const result = await createWarrantyAction(formData);

      if (result && result.success) {
        showToast("Warranty created successfully!", "success");

        // TODO: After warranty is created, send the warranty parts
        // This would require a separate API call with the warranty ID
        // For now, log the parts that would be sent
        console.log("Warranty parts to be created:", warrantyParts);

        setTimeout(() => {
          router.push("/admin/warranties");
        }, 500);
      } else if (result) {
        showToast(`Error: ${result.error}`, "error");
      } else {
        showToast("An unexpected error occurred", "error");
      }
    }
    setFormData(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setFormData(null);
    setWarrantyParts([]);
  };

  // Confirmation Modal
  const ConfirmModal = () => {
    if (!showConfirmModal || !formData) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Confirm Warranty Details
          </h3>

          <div className="space-y-4 text-sm">
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Client Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData).map(([key, value]) => {
                  if (key === "shopId" || key === "invoiceAttachmentUrl")
                    return null;
                  return (
                    <div key={key}>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {camelToNormalCase(key)}:
                      </span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {value || "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Selected Car Parts ({warrantyParts.length})
              </h4>
              {warrantyParts.length > 0 ? (
                <div className="space-y-2">
                  {warrantyParts.map((part, index) => {
                    const partData = Array.from(selectedCarParts.values()).find(
                      (p) => p.carPartId === part.carPartId
                    );
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
                      >
                        <p className="font-medium">{partData?.carPartName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Allocation ID: {part.productAllocationId}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-red-600">No car parts selected</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleConfirm}
              disabled={warrantyParts.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Create
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ConfirmModal />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-12">
          {/* Basic warranty fields */}
          <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Warranty Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Shop ID <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("shopId", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
                {errors.shopId && (
                  <p className="mt-1 text-sm text-red-600">Required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Client Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("clientName", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-600">Required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Client Contact <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("clientContact", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
                {errors.clientContact && (
                  <p className="mt-1 text-sm text-red-600">Required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Client Email <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("clientEmail", { required: true })}
                  type="email"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
                {errors.clientEmail && (
                  <p className="mt-1 text-sm text-red-600">Required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Car Brand <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("carBrand", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Car Model <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("carModel", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Car Colour <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("carColour", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Car Plate No <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("carPlateNo", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Car Chassis No <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("carChassisNo", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Installation Date <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("installationDate", { required: true })}
                  type="date"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Reference No
                </label>
                <input
                  {...register("referenceNo")}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Warranty No <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warrantyNo", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Invoice Attachment URL <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("invoiceAttachmentUrl", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>
            </div>
          </div>

          {/* Car Parts Selection */}
          <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Car Parts Selection
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Select car parts and provide details for each
            </p>

            <div className="space-y-4">
              {carParts.map((carPart) => {
                const isSelected = selectedCarParts.has(carPart.id);
                const partData = selectedCarParts.get(carPart.id);

                return (
                  <div
                    key={carPart.id}
                    className={`border rounded-lg p-4 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`carPart-${carPart.id}`}
                        checked={isSelected}
                        onChange={() => toggleCarPart(carPart.id, carPart.name)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`carPart-${carPart.id}`}
                          className="block font-medium text-gray-900 dark:text-white cursor-pointer"
                        >
                          {carPart.name} ({carPart.code})
                        </label>
                        {carPart.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {carPart.description}
                          </p>
                        )}

                        {isSelected && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Product Allocation ID *
                              </label>
                              {/* Select and options from productsFromAllocation */}
                              {/* options need to show brand name, type, series and product name and warranty in months */}
                              {/* key is productAllocationId */}
                              <select
                                value={partData?.productAllocationId || 0}
                                onChange={(e) =>
                                  updateCarPartDetails(
                                    carPart.id,
                                    "productAllocationId",
                                    parseInt(e.target.value, 10)
                                  )
                                }
                                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                              >
                                <option value={0} disabled>
                                  Select Product Allocation
                                </option>
                                {productsFromAllocation &&
                                  productsFromAllocation.map((product) => (
                                    <option
                                      key={product.productAllocationId}
                                      value={product.productAllocationId}
                                    >
                                      {`${product.brandName} - ${product.typeName} - ${product.seriesName} - ${product.productName}`}{" "}
                                      ({product.warrantyInMonths} months)
                                    </option>
                                  ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Installation Image *
                              </label>
                              <div className="mt-2 flex items-center gap-4">
                                {/* Image Preview */}
                                <div className="relative h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-primary/50 transition-colors overflow-hidden group">
                                  <input
                                    type="file"
                                    id={`image-upload-${carPart.id}`}
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file)
                                        handleImageUpload(carPart.id, file);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={uploadingImages.get(carPart.id)}
                                  />
                                  {imagePreview.get(carPart.id) ||
                                  partData?.installationImageUrl ? (
                                    <img
                                      src={
                                        imagePreview.get(carPart.id) ||
                                        partData?.installationImageUrl
                                      }
                                      alt="Installation preview"
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                                      <svg
                                        className="h-8 w-8 text-gray-400 group-hover:text-primary/50 transition-colors"
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
                                      <span className="text-xs text-gray-500 mt-1">
                                        {uploadingImages.get(carPart.id)
                                          ? "Uploading..."
                                          : "Upload"}
                                      </span>
                                    </div>
                                  )}
                                  {(imagePreview.get(carPart.id) ||
                                    partData?.installationImageUrl) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                      <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        {uploadingImages.get(carPart.id)
                                          ? "Uploading..."
                                          : "Change"}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* URL Input (Optional - for manual entry) */}
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={partData?.installationImageUrl || ""}
                                    onChange={(e) =>
                                      updateCarPartDetails(
                                        carPart.id,
                                        "installationImageUrl",
                                        e.target.value
                                      )
                                    }
                                    className="block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                                    placeholder="Or enter image URL manually"
                                  />
                                  <p className="mt-1 text-xs text-gray-500">
                                    Upload an image or enter URL manually
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCarParts.size === 0 && (
              <p className="mt-4 text-sm text-red-600">
                Please select at least one car part.
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => router.push("/admin/warranties")}
            className="text-sm font-semibold text-gray-900 dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Create Warranty
          </button>
        </div>
      </form>
    </div>
  );
}
