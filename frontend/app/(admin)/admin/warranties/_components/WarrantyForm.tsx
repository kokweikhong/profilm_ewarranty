"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  CarPart,
  Warranty,
  CreateWarrantyPartRequest,
  CreateWarrantyRequest,
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
  UpdateWarrantyRequest,
  WarrantyWithPartsResponse,
  UpdateWarrantyPartRequest,
} from "@/types/warrantiesType";
import {
  createWarrantyWithPartsAction,
  updateWarrantyAction,
} from "@/actions/warrantiesAction";
import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import { camelToNormalCase } from "@/lib/utils";
import { getProductsFromAllocationByShopIdApi } from "@/lib/apis/productAllocationsApi";
import { generateNextWarrantyNoApi } from "@/lib/apis/warrantiesApi";
import { uploadFile } from "@/lib/apis/uploadsApi";

type Props = {
  data?: WarrantyWithPartsResponse | null;
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
  data,
  carParts,
  productsFromAllocation,
  mode = "create",
}: Props) {
  const isEditMode = mode === "update" && data;
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
          parts: data.parts.map((part) => ({
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
  useEffect(() => {
    if (isEditMode && data?.parts && fields.length === 0) {
      data.parts.forEach((part) => {
        append({
          partId: part.id,
          carPartId: part.carPartId,
          productAllocationId: part.productAllocationId,
          installationImageUrl: part.installationImageUrl,
        } as any);
      });
    }
  }, [isEditMode, data, append, fields.length]);

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
              formattedDate
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
            value.warranty.installationDate
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
    setValue("warranty.invoiceAttachmentUrl", "pending-upload");

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
  // const toggleCarPart = (carPartId: number, carPartName: string) => {
  //   const newSelected = new Map(selectedCarParts);
  //   if (newSelected.has(carPartId)) {
  //     newSelected.delete(carPartId);
  //   } else {
  //     newSelected.set(carPartId, {
  //       carPartId,
  //       carPartName,
  //       productAllocationId: 0,
  //       installationImageUrl:"",
  //     });
  //   }
  //   setSelectedCarParts(newSelected);
  // };

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

  const onSubmit: SubmitHandler<CreateWarrantyWithPartsRequest> = (data) => {
    console.log("Form data before validation:", data);
    // Validate custom requirements
    const errors: string[] = [];

    // Check if invoice file is selected (only in create mode)
    if (!isEditMode) {
      if (!invoiceFile) {
        errors.push("Invoice attachment is required");
      } else if (invoiceFileSizeError || invoiceFile.size >= MAX_FILE_SIZE) {
        errors.push("Invoice file size exceeds 50MB limit");
      }
    }

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

      // Check if installation image is selected (only in create mode or if new image uploaded)
      if (!isEditMode && !selectedFiles.has(part.carPartId)) {
        errors.push(`${carPartName}: Installation image is required`);
      } else if (selectedFiles.has(part.carPartId)) {
        const imageFile = selectedFiles.get(part.carPartId);
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
                  `Missing ID for warranty part: ${part.carPartId}`
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

          console.log("Updating warranty:", updatedWarranty);
          console.log("Updating parts:", updatedWarrantyParts);
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

          const updatedWarrantyParts: CreateWarrantyPartRequest[] =
            warrantyParts.map((part) => {
              const uploadedImageUrl = installationImages.get(part.carPartId);
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

          console.log("Creating warranty:", requestData);
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
          error
        );
        showToast(
          `Failed to ${isEditMode ? "update" : "create"} warranty: ${
            error.message || "Unknown error"
          }`,
          "error"
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
  };

  // Confirmation Modal
  const ConfirmModal = () => {
    if (!showConfirmModal || !formData) return null;

    const warranty = formData.warranty;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white  rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">
            {isEditMode
              ? "Confirm Warranty Update"
              : "Confirm Warranty Details"}
          </h3>

          <div className="space-y-6 text-sm">
            {/* Warranty Information */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-900  mb-3">
                Warranty Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-700">
                    Warranty No:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {warranty.warrantyNo}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Installation Date:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {warranty.installationDate}
                  </span>
                </div>
                {warranty.referenceNo && (
                  <div>
                    <span className="font-medium text-gray-700">
                      Reference No:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {warranty.referenceNo}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Client Information */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-900  mb-3">
                Client Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.clientName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.clientContact}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.clientEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-900  mb-3">
                Vehicle Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-700">Brand:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.carBrand}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Model:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.carModel}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Colour:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.carColour}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Plate No:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.carPlateNo}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Chassis No:</span>
                  <span className="ml-2 text-gray-900">
                    {warranty.carChassisNo}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Attachment */}
            {(invoiceFile || invoicePreview) && (
              <div className="border-b pb-4">
                <h4 className="font-semibold text-gray-900  mb-3">
                  Invoice Attachment
                </h4>
                {invoicePreview ? (
                  <img
                    src={invoicePreview}
                    alt="Invoice preview"
                    className="max-h-48 rounded border border-gray-300"
                  />
                ) : invoiceFile ? (
                  <div className="flex items-center gap-2 text-gray-700">
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
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{invoiceFile.name}</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Car Parts with Installation Images */}
            <div>
              <h4 className="font-semibold text-gray-900  mb-3">
                Selected Car Parts ({warrantyParts.length})
              </h4>
              {warrantyParts.length > 0 ? (
                <div className="space-y-4">
                  {warrantyParts.map((part, index) => {
                    const carPart = carParts.find(
                      (cp) => cp.id === part.carPartId
                    );
                    const product = productsFromAllocation?.find(
                      (p) => p.productAllocationId === part.productAllocationId
                    );
                    const imageUrl =
                      imagePreview.get(part.carPartId) ||
                      part.installationImageUrl;

                    return (
                      <div key={index} className="bg-gray-50  p-4 rounded-md">
                        <div className="flex gap-4">
                          {/* Installation Image Preview */}
                          {imageUrl && (
                            <div className="shrink-0">
                              <img
                                src={imageUrl}
                                alt={`${carPart?.name} installation`}
                                className="h-24 w-24 object-contain rounded border border-gray-300"
                              />
                            </div>
                          )}

                          {/* Part Details */}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {carPart?.name || `Car Part ${part.carPartId}`}
                            </p>
                            {carPart?.code && (
                              <p className="text-xs text-gray-500">
                                Code: {carPart.code}
                              </p>
                            )}
                            {product && (
                              <div className="mt-2 text-xs">
                                <p className="text-gray-700">
                                  <span className="font-medium">Product:</span>
                                  {""}
                                  {product.brandName} - {product.typeName} -{""}
                                  {product.seriesName} - {product.productName}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Warranty:</span>
                                  {""}
                                  {product.warrantyInMonths} months
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
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
              {isUploading
                ? "Uploading..."
                : isEditMode
                ? "Confirm Update"
                : "Confirm Create"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300  text-gray-800  rounded-md hover:bg-gray-400  transition-colors"
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
          {/* Basic warranty fields */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900  mb-6">
              Warranty Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* shopId is automatically set from logged-in user */}
              <input
                {...register("warranty.shopId", {
                  required: true,
                  valueAsNumber: true,
                })}
                type="hidden"
              />

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Client Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.clientName", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
                {errors.warranty?.clientName && (
                  <p className="mt-1 text-sm text-red-600">Required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Client Contact <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.clientContact", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
                {errors.warranty?.clientContact && (
                  <p className="mt-1 text-sm text-red-600">Required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Client Email <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.clientEmail", { required: true })}
                  type="email"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
                {errors.warranty?.clientEmail && (
                  <p className="mt-1 text-sm text-red-600">Required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Car Brand <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.carBrand", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Car Model <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.carModel", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Car Colour <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.carColour", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Car Plate No <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.carPlateNo", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Car Chassis No <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.carChassisNo", { required: true })}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Installation Date <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.installationDate", { required: true })}
                  type="date"
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Reference No
                </label>
                <input
                  {...register("warranty.referenceNo")}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Warranty No <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.warrantyNo", { required: true })}
                  readOnly
                  disabled
                  className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 outline-1 outline-gray-300 cursor-not-allowed"
                  placeholder="Auto-generated"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This will be automatically generated
                </p>
              </div>

              {/* Warranty invoice attachment url */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900">
                  Invoice Attachment <span className="text-red-600">*</span>
                </label>
                <input
                  {...register("warranty.invoiceAttachmentUrl")}
                  type="hidden"
                />
                {!invoiceFile && !isEditMode && (
                  <p className="mt-1 text-xs text-red-600">
                    Invoice file is required
                  </p>
                )}
                <div className="mt-2">
                  <div className="relative w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50  hover:border-primary/50 transition-colors overflow-hidden group">
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
                              <p className="text-sm font-medium text-gray-900">
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
                                  setValue("warranty.invoiceAttachmentUrl", "");
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 h-16 w-16 bg-red-100  rounded flex items-center justify-center">
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
                              <p className="text-sm font-medium text-gray-900">
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
                                  setValue("warranty.invoiceAttachmentUrl", "");
                                }}
                                className="mt-2 text-sm text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : isEditMode && data?.warranty.invoiceAttachmentUrl ? (
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="shrink-0 h-16 w-16 bg-blue-100  rounded flex items-center justify-center">
                            <svg
                              className="h-8 w-8 text-blue-600"
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
                            <p className="text-sm font-medium text-gray-900">
                              Existing Invoice
                            </p>
                            <a
                              href={data.warranty.invoiceAttachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:text-primary/80 underline mt-1 inline-block"
                            >
                              View Invoice
                            </a>
                            <p className="text-xs text-gray-500 mt-1">
                              Click to upload a new invoice
                            </p>
                          </div>
                        </div>
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
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900  mb-2">
              Car Parts Selection
            </h2>
            <p className="text-sm text-gray-600  mb-6">
              Select car parts and provide details for each
            </p>

            <div className="space-y-4">
              {carParts.map((carPart) => {
                const fieldIndex = fields.findIndex(
                  (f) => f.carPartId === carPart.id
                );
                const isSelected = fieldIndex !== -1;

                // In edit mode, only show selected car parts
                if (isEditMode && !isSelected) {
                  return null;
                }

                return (
                  <div
                    key={carPart.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`carPart-${carPart.id}`}
                        checked={isSelected}
                        onChange={() => toggleCarPart(carPart.id, carPart.name)}
                        disabled={!!(isEditMode && isSelected)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`carPart-${carPart.id}`}
                          className={`block font-medium text-gray-900  ${
                            isEditMode && isSelected
                              ? "cursor-default"
                              : "cursor-pointer"
                          }`}
                        >
                          {carPart.name} ({carPart.code})
                        </label>
                        {carPart.description && (
                          <p className="text-sm text-gray-500  mt-1">
                            {carPart.description}
                          </p>
                        )}

                        {isSelected && (
                          <div className="mt-4 space-y-4">
                            {/* PRODUCT SELECT */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Product <span className="text-red-600">*</span>
                              </label>
                              <select
                                {...register(
                                  `parts.${fieldIndex}.productAllocationId`,
                                  {
                                    required: true,
                                    valueAsNumber: true,
                                  }
                                )}
                                className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-primary/60"
                              >
                                <option value={0} disabled>
                                  Select Product
                                </option>
                                {productsFromAllocation?.map((product) => (
                                  <option
                                    key={product.productAllocationId}
                                    value={product.productAllocationId}
                                  >
                                    {`${product.brandName} - ${product.typeName} - ${product.seriesName} - ${product.productName}`}
                                    {""}({product.warrantyInMonths} months)
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* IMAGE UPLOAD */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Installation Image{""}
                                <span className="text-red-600">*</span>
                              </label>
                              <div className="mt-2">
                                {selectedFiles.has(carPart.id) && (
                                  <div className="mb-2">
                                    <p
                                      className={`text-xs ${
                                        imageFileSizeErrors.get(carPart.id)
                                          ? "text-red-600 font-semibold"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      File size:{""}
                                      {(
                                        selectedFiles.get(carPart.id)!.size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}
                                      {""}
                                      MB
                                      {imageFileSizeErrors.get(carPart.id) &&
                                        " - Exceeds 50MB limit!"}
                                    </p>
                                  </div>
                                )}
                                <div className="relative w-full h-64 sm:h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50  hover:border-primary/50 transition-colors overflow-hidden group">
                                  <input
                                    type="file"
                                    id={`image-upload-${carPart.id}`}
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleImageSelect(carPart.id, file);
                                      }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  {imagePreview.get(carPart.id) ||
                                  fields[fieldIndex]?.installationImageUrl ? (
                                    <>
                                      <img
                                        src={
                                          imagePreview.get(carPart.id) ||
                                          fields[fieldIndex]
                                            ?.installationImageUrl
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
                                      <span className="text-sm text-gray-500  mt-2">
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

            {fields.length === 0 && (
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
