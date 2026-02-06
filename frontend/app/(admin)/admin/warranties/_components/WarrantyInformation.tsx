"use client";

import { useToast } from "@/contexts/ToastContext";
import {
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
  WarrantyWithPartsResponse,
} from "@/types/warrantiesType";
import { FC, useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props = {
  register: UseFormRegister<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest
  >;
  errors: FieldErrors<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest
  >;
  isEditMode: boolean;
  data?: WarrantyWithPartsResponse;
  setValue: UseFormSetValue<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest
  >;
  invoiceFile: File | null;
  setInvoiceFile: (file: File | null) => void;
  invoicePreview: string | null;
  setInvoicePreview: (preview: string | null) => void;
  fileInputKey: number;
};

const WarrantyInformation: FC<Props> = ({
  register,
  errors,
  isEditMode,
  data,
  setValue,
  invoiceFile,
  setInvoiceFile,
  invoicePreview,
  setInvoicePreview,
  fileInputKey,
}) => {
  console.log("Invoice URL:", data?.warranty.invoiceAttachmentUrl);
  console.log("Is Edit Mode:", data);
  // const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [invoiceFileSizeError, setInvoiceFileSizeError] = useState(false);
  const { showToast } = useToast();

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  // Handle invoice file selection (preview only, no upload yet)
  const handleInvoiceSelect = (file: File): void => {
    if (!file) return;

    // Check file size
    if (file.size >= MAX_FILE_SIZE) {
      setInvoiceFileSizeError(true);
      showToast(
        `Invoice file size (${(file.size / 1024 / 1024).toFixed(
          2,
        )} MB) exceeds 50MB limit`,
        "error",
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
  return (
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
            className="form-input-text"
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
            className="form-input-text"
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
            className="form-input-text"
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
            className="form-input-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Car Model <span className="text-red-600">*</span>
          </label>
          <input
            {...register("warranty.carModel", { required: true })}
            className="form-input-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Car Colour <span className="text-red-600">*</span>
          </label>
          <input
            {...register("warranty.carColour", { required: true })}
            className="form-input-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Car Plate Number <span className="text-red-600">*</span>
          </label>
          <input
            {...register("warranty.carPlateNo", { required: true })}
            className="form-input-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Car Chassis Number <span className="text-red-600">*</span>
          </label>
          <input
            {...register("warranty.carChassisNo", { required: true })}
            className="form-input-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Installation Date <span className="text-red-600">*</span>
          </label>
          <input
            {...register("warranty.installationDate", { required: true })}
            type="date"
            className="form-input-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Reference No
          </label>
          <input
            {...register("warranty.referenceNo")}
            className="form-input-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Warranty Number <span className="text-red-600">*</span>
          </label>
          <input
            {...register("warranty.warrantyNo", { required: true })}
            readOnly
            disabled
            className="form-input-text bg-gray-100 cursor-not-allowed"
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
          <input {...register("warranty.invoiceAttachmentUrl")} type="hidden" />
          {!invoiceFile && !isEditMode && (
            <p className="mt-1 text-xs text-red-600">
              Invoice file is required
            </p>
          )}
          <div className="mt-2">
            <div className="relative w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50  hover:border-primary/50 transition-colors overflow-hidden group">
              <input
                key={fileInputKey}
                type="file"
                id="invoice-upload"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInvoiceSelect(file);
                    e.target.value = "";
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {invoiceFile ? (
                <div className="p-4 relative">
                  {invoiceFile.type.startsWith("image/") && invoicePreview ? (
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
                          {invoiceFileSizeError && " - Exceeds 50MB limit!"}
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
                          className="mt-2 text-sm text-red-600 hover:text-red-700 relative z-20"
                          style={{ pointerEvents: "auto" }}
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
                          {invoiceFileSizeError && " - Exceeds 50MB limit!"}
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
                          className="mt-2 text-sm text-red-600 hover:text-red-700 relative z-20"
                          style={{ pointerEvents: "auto" }}
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
  );
};

export default WarrantyInformation;
