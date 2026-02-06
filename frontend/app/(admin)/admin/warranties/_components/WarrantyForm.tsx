"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  CarPart,
  CreateWarrantyPartRequest,
  CreateWarrantyRequest,
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
  UpdateWarrantyRequest,
  WarrantyWithPartsResponse,
  UpdateWarrantyPartRequest,
  WarrantyApprovalStatus,
} from "@/types/warrantiesType";
import {
  createWarrantyPartAction,
  createWarrantyWithPartsAction,
  updateWarrantyAction,
} from "@/actions/warrantiesAction";
import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import { camelToNormalCase } from "@/lib/utils";
import { getProductsFromAllocationByShopIdApi } from "@/lib/apis/productAllocationsApi";
import { generateNextWarrantyNoApi } from "@/lib/apis/warrantiesApi";
import { uploadFile } from "@/lib/apis/uploadsApi";
import ConfirmModal from "./ConfirmModal";
import WarrantyInformation from "./WarrantyInformation";
import WarrantyPartsSelection from "./WarrantyPartsSelection";

type Props = {
  data?: WarrantyWithPartsResponse | null;
  carParts: CarPart[];
  productsFromAllocation?: ProductsFromAllocationByShopIdResponse[];
  mode: "create" | "update";
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
  data,
  carParts,
  productsFromAllocation,
  mode,
}: Props) {
  const isEditMode: boolean =
    mode === "update" && data !== null && data !== undefined;
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();

  // Check if user is admin - admins cannot create/edit warranties
  const isAdmin = user?.role === "admin";

  if (isAdmin || (!isAdmin && !user?.shopId)) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Access Restricted
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Only shop users are allowed to create or edit warranties. Admin
                users can only view warranty records.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State for managing selected car parts with their details
  const [selectedCarParts, setSelectedCarParts] = useState<
    Map<number, WarrantyPartData>
  >(new Map());

  console.log(data);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest>({
    defaultValues: isEditMode
      ? {
          warranty: {
            id: data!.warranty.id,
            shopId: data!.warranty.shopId,
            clientName: data!.warranty.clientName,
            clientContact: data!.warranty.clientContact,
            clientEmail: data!.warranty.clientEmail,
            carBrand: data!.warranty.carBrand,
            carModel: data!.warranty.carModel,
            carColour: data!.warranty.carColour,
            carPlateNo: data!.warranty.carPlateNo,
            carChassisNo: data!.warranty.carChassisNo,
            installationDate: data!.warranty.installationDate, // Format: YYYY-MM-DD
            referenceNo: data!.warranty.referenceNo, // Optional
            warrantyNo: data!.warranty.warrantyNo,
            invoiceAttachmentUrl: data!.warranty.invoiceAttachmentUrl,
          },
          parts: data!.parts.map((part) => ({
            partId: part.id,
            carPartId: part.carPartId,
            productAllocationId: part.productAllocationId,
            installationImageUrl: part.installationImageUrl,
          })),
        }
      : {
          warranty: {
            // shopId: user.shopId,
            installationDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
          },
          parts: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  });

  // Initialize parts in edit mode
  // useEffect(() => {
  //   if (isEditMode && data?.parts && fields.length === 0) {
  //     data.parts.forEach((part) => {
  //       append({
  //         partId: part.id,
  //         carPartId: part.carPartId,
  //         productAllocationId: part.productAllocationId,
  //         installationImageUrl: part.installationImageUrl,
  //       } as any);
  //     });
  //   }
  // }, [isEditMode, data, append, fields.length]);

  // Automatically set shopId from logged-in user in create mode
  useEffect(() => {
    if (!isEditMode && user?.shopId) {
      setValue("warranty.shopId", user.shopId);
      console.log("Set shopId to", user.shopId);
      // Automatically generate warranty number based on shop's branch code and installation date
      const generateWarrantyNo = async () => {
        const installationDate = watch("warranty.installationDate");
        if (user.shopId && installationDate) {
          try {
            const branchCode = user.username.toUpperCase(); // Adjust if branchCode is different
            // date format YYYYMMDD
            const formattedDate = formatDateForInput(installationDate);
            const response = await generateNextWarrantyNoApi(
              branchCode,
              formattedDate,
            );
            setValue("warranty.warrantyNo", response.warrantyNo);
            console.log("Generated warranty number:", response.warrantyNo);
          } catch (error) {
            console.error("Failed to generate warranty number:", error);
          }
        }
      };
      generateWarrantyNo();
    }
  }, [isEditMode, user, setValue]);

  // Update warranty number when installation date changes in create mode
  useEffect(() => {
    if (!isEditMode && user?.shopId) {
      const subscription = watch((value, { name }) => {
        if (
          name === "warranty.installationDate" &&
          value.warranty?.installationDate
        ) {
          const branchCode = user.username.toUpperCase();
          const formattedDate = formatDateForInput(
            value.warranty.installationDate,
          );
          generateNextWarrantyNoApi(branchCode, formattedDate)
            .then((response) => {
              setValue("warranty.warrantyNo", response.warrantyNo);
              console.log("Updated warranty number:", response.warrantyNo);
            })
            .catch((error) => {
              console.error("Failed to update warranty number:", error);
            });
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isEditMode, user, setValue, watch]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest | null
  >(null);
  const [warrantyParts, setWarrantyParts] = useState<
    (CreateWarrantyPartRequest | UpdateWarrantyPartRequest)[]
  >([]);
  const [uploadingImages, setUploadingImages] = useState<Map<number, boolean>>(
    new Map(),
  );
  const [imagePreview, setImagePreview] = useState<Map<number, string>>(
    new Map(),
  );
  const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(
    new Map(),
  );
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [imageFileSizeErrors, setImageFileSizeErrors] = useState<
    Map<number, boolean>
  >(new Map());

  // const [warrantyPartsImageFiles, setWarrantyPartsImageFiles] = useState<

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  // Handle image file selection (preview only, no upload yet)
  const handleImageSelect = (fieldIdx: number, file: File): void => {
    if (!file) return;

    // Check file size
    if (file.size >= MAX_FILE_SIZE) {
      setImageFileSizeErrors((prev) => new Map(prev).set(fieldIdx, true));
      showToast(
        `Image file size (${(file.size / 1024 / 1024).toFixed(
          2,
        )} MB) exceeds 50MB limit`,
        "error",
      );
    } else {
      setImageFileSizeErrors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(fieldIdx);
        return newMap;
      });
    }

    // Store the file for later upload
    setSelectedFiles((prev) => new Map(prev).set(fieldIdx, file));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview((prev) =>
        new Map(prev).set(fieldIdx, reader.result as string),
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
      for (const [fieldIdx, file] of selectedFiles.entries()) {
        try {
          setUploadingImages((prev) => new Map(prev).set(fieldIdx, true));
          const imageUrl = await uploadFile(file, "warranties/installations");
          installationImages.set(fieldIdx, imageUrl);
          // ...
        } finally {
          setUploadingImages((prev) => {
            const newMap = new Map(prev);
            newMap.set(fieldIdx, false);
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
    // Check if this part is already in the 'parts' field array
    const index = fields.findIndex((field) => field.carPartId === carPartId);

    if (index === -1) {
      // If not found, ADD (Append) it
      append({
        carPartId: carPartId,
        productAllocationId: 0,
        installationImageUrl: "",
      });
      // Also update selectedCarParts for UI state
      const newSelected = new Map(selectedCarParts);
      newSelected.set(carPartId, {
        carPartId,
        carPartName,
        productAllocationId: 0,
        installationImageUrl: "",
      });
      setSelectedCarParts(newSelected);
    } else {
      // If found, REMOVE it
      remove(index);
      // Also remove from selectedCarParts
      const newSelected = new Map(selectedCarParts);
      newSelected.delete(carPartId);
      setSelectedCarParts(newSelected);
    }
  };

  // Update car part details
  const updateCarPartDetails = (
    carPartId: number,
    field: "productAllocationId" | "installationImageUrl",
    value: number | string,
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

  const onSubmit: SubmitHandler<CreateWarrantyWithPartsRequest> = (data) => {
    console.log("Form data before validation:", data);
    // Validate custom requirements
    const errors: string[] = [];

    // Check if invoice file is selected (only in create mode)
    // TODO: enable invoice requirement later
    // if (!isEditMode) {
    //   if (!invoiceFile) {
    //     errors.push("Invoice attachment is required");
    //   } else if (invoiceFileSizeError || invoiceFile.size >= MAX_FILE_SIZE) {
    //     errors.push("Invoice file size exceeds 50MB limit");
    //   }
    // }

    // Check if at least one car part is selected
    if (!data.parts || data.parts.length === 0) {
      errors.push("Please select at least one car part");
    }

    // Validate each selected car part
    data.parts?.forEach((part, index) => {
      const carPart = carParts.find((cp) => cp.id === part.carPartId);
      const carPartName = carPart?.name || `Car Part ${part.carPartId}`;

      // Check if product is selected
      if (!part.productAllocationId || part.productAllocationId === 0) {
        errors.push(`${carPartName}: Product selection is required`);
      }

      // Use index instead of carPartId for selectedFiles
      if (!isEditMode && !selectedFiles.has(index)) {
        errors.push(`${carPartName}: Installation image is required`);
      } else if (selectedFiles.has(index)) {
        const imageFile = selectedFiles.get(index);
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

    // Convert installation date to ISO 8601 format (RFC3339)
    const installationDate = new Date(data.warranty.installationDate);
    const formattedInstallationDate = installationDate.toISOString();

    // Prepare warranty data with proper structure
    const warrantyData: CreateWarrantyRequest = {
      shopId: user!.shopId!,
      clientName: data.warranty.clientName,
      clientContact: data.warranty.clientContact,
      clientEmail: data.warranty.clientEmail,
      carBrand: data.warranty.carBrand,
      carModel: data.warranty.carModel,
      carColour: data.warranty.carColour,
      carPlateNo: data.warranty.carPlateNo,
      carChassisNo: data.warranty.carChassisNo,
      installationDate: formattedInstallationDate,
      referenceNo: data.warranty.referenceNo || "",
      warrantyNo: data.warranty.warrantyNo,
      invoiceAttachmentUrl: data.warranty.invoiceAttachmentUrl,
    };

    // Use parts from form data - different types for create vs update
    const parts: (CreateWarrantyPartRequest | UpdateWarrantyPartRequest)[] =
      data.parts.map((part, index) => {
        const basePart: CreateWarrantyPartRequest = {
          carPartId: part.carPartId,
          productAllocationId: part.productAllocationId,
          installationImageUrl: part.installationImageUrl || "",
        };

        // Include existing part ID in edit mode if available
        if (isEditMode && index < fields.length) {
          const originalPart = fields[index] as any;
          if (originalPart?.partId) {
            return {
              ...basePart,
              id: originalPart.partId,
            } as UpdateWarrantyPartRequest;
          }
        }

        return basePart;
      });

    setFormData({ warranty: warrantyData, parts: parts as any });
    setWarrantyParts(parts);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);

    if (formData) {
      try {
        setIsUploading(true);

        if (isEditMode) {
          // EDIT MODE: Update existing warranty
          // Upload new files if any
          const { installationImages, invoiceUrl } = await uploadAllFiles();

          // Convert installation date to ISO 8601 format (RFC3339)
          const installationDate = new Date(formData.warranty.installationDate);
          const formattedInstallationDate = installationDate.toISOString();

          const updatedWarranty: UpdateWarrantyRequest = {
            ...formData.warranty,
            id: data!.warranty.id,
            installationDate: formattedInstallationDate,
            invoiceAttachmentUrl:
              invoiceUrl || formData.warranty.invoiceAttachmentUrl,
          };

          // Map parts with updated image URLs and include existing part IDs
          const updatedWarrantyParts: UpdateWarrantyPartRequest[] =
            warrantyParts.map((part, index) => {
              const uploadedImageUrl = installationImages.get(part.carPartId);
              const updatePart = part as any;
              const partId =
                updatePart.id || fields[index]?.id || data!.parts[index]?.id;

              if (!partId) {
                console.error("Missing part ID for update:", part);
                throw new Error(
                  `Missing ID for warranty part: ${part.carPartId}`,
                );
              }

              return {
                id: partId,
                warrantyId: data!.warranty.id,
                carPartId: part.carPartId,
                productAllocationId: part.productAllocationId,
                installationImageUrl:
                  uploadedImageUrl || part.installationImageUrl,
              };
            });

          // check if updatedWarrantyParts have ids with string type and create first
          for (const part of updatedWarrantyParts) {
            if (typeof part.id === "string") {
              const createPartData: any = {
                warrantyId: updatedWarranty.id!,
                carPartId: part.carPartId,
                productAllocationId: part.productAllocationId,
                installationImageUrl: part.installationImageUrl,
              };
              const createResult =
                await createWarrantyPartAction(createPartData);
              if (createResult && createResult.success) {
                part.id = createResult.data.id;
              } else {
                throw new Error(
                  `Failed to create warranty part for carPartId: ${part.carPartId}`,
                );
              }
            }
          }

          const result = await updateWarrantyAction({
            warranty: updatedWarranty,
            parts: updatedWarrantyParts,
          });

          if (result && result.success) {
            showToast("Warranty updated successfully!", "success");
            setTimeout(() => {
              router.push("/admin/warranties");
            }, 500);
          } else if (result) {
            showToast(`Error: ${result.error}`, "error");
          } else {
            showToast("An unexpected error occurred", "error");
          }
        } else {
          // CREATE MODE: Create new warranty with parts
          const { installationImages, invoiceUrl } = await uploadAllFiles();

          // Convert installation date to ISO 8601 format (RFC3339)
          const installationDate = new Date(formData.warranty.installationDate);
          const formattedInstallationDate = installationDate.toISOString();

          const updatedWarranty: CreateWarrantyRequest = {
            ...formData.warranty,
            shopId: user!.shopId!,
            installationDate: formattedInstallationDate,
            invoiceAttachmentUrl:
              invoiceUrl || formData.warranty.invoiceAttachmentUrl,
          };

          // const updatedWarrantyParts: CreateWarrantyPartRequest[] =
          //   warrantyParts.map((part) => {
          //     const uploadedImageUrl = installationImages.get(part.carPartId);
          //     return {
          //       carPartId: part.carPartId,
          //       productAllocationId: part.productAllocationId,
          //       installationImageUrl:
          //         uploadedImageUrl || part.installationImageUrl,
          //     };
          //   });
          const updatedWarrantyParts: CreateWarrantyPartRequest[] =
            warrantyParts.map((part, index) => {
              const uploadedImageUrl = installationImages.get(index); // use index
              return {
                carPartId: part.carPartId,
                productAllocationId: part.productAllocationId,
                installationImageUrl:
                  uploadedImageUrl || part.installationImageUrl,
              };
            });

          const requestData: CreateWarrantyWithPartsRequest = {
            warranty: updatedWarranty,
            parts: updatedWarrantyParts,
          };

          const result = await createWarrantyWithPartsAction(requestData);

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
        }
      } catch (error: any) {
        console.error(
          `Error during warranty ${isEditMode ? "update" : "creation"}:`,
          error,
        );
        showToast(
          `Failed to ${isEditMode ? "update" : "create"} warranty: ${
            error.message || "Unknown error"
          }`,
          "error",
        );
      } finally {
        setIsUploading(false);
      }
    }
    setFormData(null);
    setWarrantyParts([]);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setFormData(null);
    setWarrantyParts([]);
    setInvoiceFile(null);
    setInvoicePreview(null);
    setSelectedFiles(new Map());
    setImagePreview(new Map());
    setUploadingImages(new Map());
    setImageFileSizeErrors(new Map());
  };

  useEffect(() => {
    if (isEditMode) {
      setInvoiceFile(null);
      setInvoicePreview(null);
    }
  }, [isEditMode]);

  if (
    isEditMode &&
    data?.warranty.approvalStatus === WarrantyApprovalStatus.APPROVED
  ) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Warranty Approved - Edit Restricted
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                This warranty has been approved and cannot be edited. If you
                need to make changes, please contact the administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        formData={formData}
        isEditMode={isEditMode}
        warrantyParts={warrantyParts}
        carParts={carParts}
        productsFromAllocation={productsFromAllocation}
        invoiceFile={invoiceFile}
        // setInvoiceFile={setInvoiceFile}
        invoicePreview={invoicePreview}
        imagePreview={imagePreview}
        isUploading={isUploading}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
      />

      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-600"
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
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700  list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setValidationErrors([])}
              className="ml-3 shrink-0 text-red-600 hover:text-red-800"
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
          {/* Warranty Information */}
          <WarrantyInformation
            register={register}
            errors={errors}
            isEditMode={isEditMode}
            data={isEditMode ? data! : undefined}
            setValue={setValue}
            invoiceFile={invoiceFile}
            setInvoiceFile={setInvoiceFile}
            invoicePreview={invoicePreview}
            setInvoicePreview={setInvoicePreview}
          />

          {/* json format form data for testing */}
          {/* <div>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(watch(), null, 2)}
            </pre>
          </div> */}

          {/* Car Parts Selection */}
          <div className="border-b border-gray-900/10 pb-12">
            <WarrantyPartsSelection
              productsFromAllocation={productsFromAllocation}
              carParts={carParts}
              fields={fields}
              handleImageSelect={handleImageSelect}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              toggleCarPart={toggleCarPart}
              append={append}
              setValue={setValue}
              remove={remove}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => router.push("/admin/warranties")}
            className="text-sm font-semibold text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {isEditMode ? "Update Warranty" : "Create Warranty"}
          </button>
        </div>
      </form>
    </div>
  );
}
