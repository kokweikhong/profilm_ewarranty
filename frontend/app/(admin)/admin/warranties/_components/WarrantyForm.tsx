"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  CarPart,
  Warranty,
  CreateWarrantyPartRequest,
  CreateWarrantyRequest,
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyRequest,
} from "@/types/warrantiesType";
import {
  createWarrantyAction,
  updateWarrantyAction,
} from "@/actions/warrantiesAction";
import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import { camelToNormalCase } from "@/lib/utils";
import { getProductsFromAllocationByShopIdApi } from "@/lib/apis/productAllocationsApi";
import { generateNextWarrantyNoApi } from "@/lib/apis/warrantiesApi";
import { uploadFile } from "@/lib/apis/uploadsApi";

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

function formatDateForInput(dateString: string): string {
  // yyyy-mm-dd to yyyymmdd
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
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
  const { user } = useAuth();

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

  // Automatically set shopId from logged-in user in create mode
  useEffect(() => {
    if (!isEditMode && user?.shopId) {
      setValue("shopId", user.shopId);
      console.log("Set shopId to", user.shopId);
      // Automatically generate warranty number based on shop's branch code and installation date
      if (!isEditMode) {
        const generateWarrantyNo = async () => {
          if (user.shopId && watch("installationDate")) {
            try {
              const branchCode = user.username.toUpperCase(); // Adjust if branchCode is different
              const installationDate = watch("installationDate");
              // date format YYYYMMDD
              const formattedDate = formatDateForInput(installationDate);
              const response = await generateNextWarrantyNoApi(
                branchCode,
                formattedDate
              );
              setValue("warrantyNo", response.warrantyNo);
              console.log("Generated warranty number:", response.warrantyNo);
            } catch (error) {
              console.error("Failed to generate warranty number:", error);
            }
          }
        };
        generateWarrantyNo();
      }
    }
  }, [isEditMode, user, setValue, watch]);

  // Update warranty number when installation date changes in create mode
  useEffect(() => {
    if (!isEditMode) {
      const installationDate = watch("installationDate");
      if (installationDate && user?.shopId) {
        const branchCode = user.username.toUpperCase(); // Adjust if branchCode is different
        const formattedDate = formatDateForInput(installationDate);
        generateNextWarrantyNoApi(branchCode, formattedDate)
          .then((response) => {
            setValue("warrantyNo", response.warrantyNo);
            console.log("Updated warranty number:", response.warrantyNo);
          })
          .catch((error) => {
            console.error("Failed to update warranty number:", error);
          });
      }
    }
  }, [isEditMode, watch("installationDate"), user, setValue]);

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
  const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(
    new Map()
  );
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [invoiceFileSizeError, setInvoiceFileSizeError] = useState(false);
  const [imageFileSizeErrors, setImageFileSizeErrors] = useState<
    Map<number, boolean>
  >(new Map());

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  // Handle invoice file selection (preview only, no upload yet)
  const handleInvoiceSelect = (file: File): void => {
    if (!file) return;

    // Check file size
    if (file.size >= MAX_FILE_SIZE) {
      setInvoiceFileSizeError(true);
      showToast(
        `Invoice file size (${(file.size / 1024 / 1024).toFixed(
          2
        )} MB) exceeds 50MB limit`,
        "error"
      );
    } else {
      setInvoiceFileSizeError(false);
    }

    setInvoiceFile(file);

    // Set a temporary placeholder value to pass form validation
    setValue("invoiceAttachmentUrl", "pending-upload");

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoicePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      // For PDFs, just show filename
      setInvoicePreview(null);
    }
  };

  // Handle image file selection (preview only, no upload yet)
  const handleImageSelect = (carPartId: number, file: File): void => {
    if (!file) return;

    // Check file size
    if (file.size >= MAX_FILE_SIZE) {
      setImageFileSizeErrors((prev) => new Map(prev).set(carPartId, true));
      showToast(
        `Image file size (${(file.size / 1024 / 1024).toFixed(
          2
        )} MB) exceeds 50MB limit`,
        "error"
      );
    } else {
      setImageFileSizeErrors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(carPartId);
        return newMap;
      });
    }

    // Store the file for later upload
    setSelectedFiles((prev) => new Map(prev).set(carPartId, file));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview((prev) =>
        new Map(prev).set(carPartId, reader.result as string)
      );
    };
    reader.readAsDataURL(file);
  };

  // Upload all files (installation images + invoice) when form is submitted
  const uploadAllFiles = async (): Promise<{
    installationImages: Map<number, string>;
    invoiceUrl: string | null;
  }> => {
    const installationImages = new Map<number, string>();
    let invoiceUrl: string | null = null;

    try {
      // Upload invoice file if selected
      if (invoiceFile) {
        invoiceUrl = await uploadFile(invoiceFile, "warranties/invoices");
        console.log("Invoice uploaded:", invoiceUrl);
      }

      // Upload installation images for each car part
      for (const [carPartId, file] of selectedFiles.entries()) {
        try {
          setUploadingImages((prev) => new Map(prev).set(carPartId, true));

          const imageUrl = await uploadFile(file, "warranties/installations");
          installationImages.set(carPartId, imageUrl);
          console.log(
            `Installation image uploaded for car part ${carPartId}:`,
            imageUrl
          );
        } catch (error) {
          console.error(
            `Error uploading image for car part ${carPartId}:`,
            error
          );
          throw error;
        } finally {
          setUploadingImages((prev) => {
            const newMap = new Map(prev);
            newMap.set(carPartId, false);
            return newMap;
          });
        }
      }

      return { installationImages, invoiceUrl };
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
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
    console.log("Form data before validation:", data);
    // Validate custom requirements
    const errors: string[] = [];

    // Check if invoice file is selected
    if (!invoiceFile) {
      errors.push("Invoice attachment is required");
    } else if (invoiceFileSizeError || invoiceFile.size >= MAX_FILE_SIZE) {
      errors.push("Invoice file size exceeds 50MB limit");
    }

    // Check if at least one car part is selected
    if (selectedCarParts.size === 0) {
      errors.push("Please select at least one car part");
    }

    // Validate each selected car part
    selectedCarParts.forEach((part, carPartId) => {
      const carPart = carParts.find((cp) => cp.id === carPartId);
      const carPartName = carPart?.name || `Car Part ${carPartId}`;

      // Check if product is selected
      if (!part.productAllocationId || part.productAllocationId === 0) {
        errors.push(`${carPartName}: Product selection is required`);
      }

      // Check if installation image is selected
      if (!selectedFiles.has(carPartId)) {
        errors.push(`${carPartName}: Installation image is required`);
      } else {
        const imageFile = selectedFiles.get(carPartId);
        if (imageFile && imageFile.size >= MAX_FILE_SIZE) {
          errors.push(`${carPartName}: Installation image exceeds 50MB limit`);
        }
      }
    });

    // If there are validation errors, show them and don't proceed
    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Clear validation errors if all is good
    setValidationErrors([]);

    // Generate warranty parts array from selected car parts
    const parts: CreateWarrantyPartRequest[] = Array.from(
      selectedCarParts.values()
    ).map((part) => ({
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
      try {
        // Upload all files first
        setIsUploading(true);
        const { installationImages, invoiceUrl } = await uploadAllFiles();

        // Update formData with uploaded invoice URL
        const updatedWarranty: CreateWarrantyRequest = {
          ...formData,
          invoiceAttachmentUrl: invoiceUrl || formData.invoiceAttachmentUrl,
        };

        // Update warranty parts with uploaded installation image URLs
        const updatedWarrantyParts: CreateWarrantyPartRequest[] =
          warrantyParts.map((part) => {
            const uploadedImageUrl = installationImages.get(part.carPartId);
            return {
              ...part,
              installationImageUrl:
                uploadedImageUrl || part.installationImageUrl,
            };
          });

        // Build the nested request structure
        const requestData: CreateWarrantyWithPartsRequest = {
          warranty: updatedWarranty,
          parts: updatedWarrantyParts,
        };

        // For create mode, send warranty data and parts
        const result = await createWarrantyAction(requestData);

        if (result && result.success) {
          showToast("Warranty created successfully!", "success");

          setTimeout(() => {
            router.push("/admin/warranties");
          }, 500);
        } else if (result) {
          showToast(`Error: ${result.error}`, "error");
        } else {
          showToast("An unexpected error occurred", "error");
        }
      } catch (error: any) {
        console.error("Error during warranty creation:", error);
        showToast(
          `Failed to create warranty: ${error.message || "Unknown error"}`,
          "error"
        );
      } finally {
        setIsUploading(false);
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
              disabled={warrantyParts.length === 0 || isUploading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Confirm Create"}
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

      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 dark:text-red-400 list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setValidationErrors([])}
              className="ml-3 shrink-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg
                className="h-5 w-5"
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
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-12">
          {/* Basic warranty fields */}
          <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Warranty Information
            </h2>

            <div>
              {/* show all json form data */}
              <pre>{JSON.stringify(watch(), null, 2)}</pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* shopId is automatically set from logged-in user */}
              <input
                {...register("shopId", {
                  required: true,
                  valueAsNumber: true,
                })}
                type="hidden"
              />

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
                  readOnly
                  disabled
                  className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 outline-1 outline-gray-300 cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Auto-generated"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will be automatically generated
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Invoice Attachment <span className="text-red-600">*</span>
                </label>
                <input {...register("invoiceAttachmentUrl")} type="hidden" />
                {!invoiceFile && (
                  <p className="mt-1 text-xs text-red-600">
                    Invoice file is required
                  </p>
                )}
                <div className="mt-2">
                  <div className="relative w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 hover:border-primary/50 transition-colors overflow-hidden group">
                    <input
                      type="file"
                      id="invoice-upload"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleInvoiceSelect(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {invoiceFile ? (
                      <div className="p-4">
                        {invoiceFile.type.startsWith("image/") &&
                        invoicePreview ? (
                          <div className="flex items-center gap-4">
                            <img
                              src={invoicePreview}
                              alt="Invoice preview"
                              className="h-32 w-32 object-contain rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoiceFile.name}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  invoiceFileSizeError
                                    ? "text-red-600 font-semibold"
                                    : "text-gray-500"
                                }`}
                              >
                                {(invoiceFile.size / 1024 / 1024).toFixed(2)} MB
                                {invoiceFileSizeError &&
                                  " - Exceeds 50MB limit!"}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInvoiceFile(null);
                                  setInvoicePreview(null);
                                  setInvoiceFileSizeError(false);
                                  setValue("invoiceAttachmentUrl", "");
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
                              <svg
                                className="h-8 w-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {invoiceFile.name}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  invoiceFileSizeError
                                    ? "text-red-600 font-semibold"
                                    : "text-gray-500"
                                }`}
                              >
                                {(invoiceFile.size / 1024 / 1024).toFixed(2)} MB
                                {invoiceFileSizeError &&
                                  " - Exceeds 50MB limit!"}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInvoiceFile(null);
                                  setInvoicePreview(null);
                                  setInvoiceFileSizeError(false);
                                  setValue("invoiceAttachmentUrl", "");
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
                        <svg
                          className="h-12 w-12 text-gray-400 group-hover:text-primary/50 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-500 mt-2">
                          Click to select invoice (Image or PDF)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
                                Product *
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
                                  Select Product
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
                              <div className="mt-2">
                                {/* Image Preview */}
                                {selectedFiles.has(carPart.id) && (
                                  <div className="mb-2">
                                    <p
                                      className={`text-xs ${
                                        imageFileSizeErrors.get(carPart.id)
                                          ? "text-red-600 font-semibold"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      File size:{" "}
                                      {(
                                        selectedFiles.get(carPart.id)!.size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{" "}
                                      MB
                                      {imageFileSizeErrors.get(carPart.id) &&
                                        " - Exceeds 50MB limit!"}
                                    </p>
                                  </div>
                                )}
                                <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 hover:border-primary/50 transition-colors overflow-hidden group">
                                  <input
                                    type="file"
                                    id={`image-upload-${carPart.id}`}
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file)
                                        handleImageSelect(carPart.id, file);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  {imagePreview.get(carPart.id) ||
                                  partData?.installationImageUrl ? (
                                    <>
                                      <img
                                        src={
                                          imagePreview.get(carPart.id) ||
                                          partData?.installationImageUrl
                                        }
                                        alt="Installation preview"
                                        className="h-full w-full object-contain"
                                      />
                                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center pointer-events-none">
                                        <span className="text-white text-sm font-medium">
                                          Change Image
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                      <svg
                                        className="h-12 w-12 text-gray-400 group-hover:text-primary/50 transition-colors"
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
                                      <span className="text-sm text-gray-500 mt-2">
                                        Click to select image
                                      </span>
                                    </div>
                                  )}
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
