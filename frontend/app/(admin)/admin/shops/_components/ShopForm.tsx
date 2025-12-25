"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { MsiaState, Shop } from "@/types/shopsType";
import { UpdateShopRequest, CreateShopRequest } from "@/types/shopsType";
import { createShopAction, updateShopAction } from "@/actions/shopsAction";
import { useToast } from "@/contexts/ToastContext";
import { uploadFile } from "@/lib/apis/uploadsApi";
import { generateNextBranchCodeApi } from "@/lib/apis/shopsApi";
import Image from "next/image";

type Props = {
  msiaStates: MsiaState[];
  shop?: Shop;
  mode?: "create" | "update";
};

export default function ShopForm({ msiaStates, shop, mode = "create" }: Props) {
  const isEditMode = mode === "update" && !!shop;
  console.log("ShopForm mode:", mode, "isEditMode:", isEditMode, "shop:", shop);
  console.log("MSIA States:", shop?.msiaStateId);
  const router = useRouter();
  const { showToast } = useToast();

  const companyLicenseInputRef = useRef<HTMLInputElement>(null);
  const shopImageInputRef = useRef<HTMLInputElement>(null);

  const [companyLicenseImagePreview, setCompanyLicenseImagePreview] = useState<
    string | null
  >(null);
  const [shopImagePreview, setShopImagePreview] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<
    CreateShopRequest | UpdateShopRequest | null
  >(null);

  // Track file changes and upload confirmation
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFileUpload, setPendingFileUpload] = useState<{
    type: "companyLicense" | "shopImage";
    file: File;
    preview: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState, watch, setValue, reset } = useForm<
    CreateShopRequest | UpdateShopRequest
  >({
    defaultValues: isEditMode
      ? {
          id: shop!.id,
          companyName: shop!.companyName,
          companyRegistrationNumber: shop!.companyRegistrationNumber,
          companyLicenseImageUrl: shop!.companyLicenseImageUrl,
          companyContactNumber: shop!.companyContactNumber,
          companyEmail: shop!.companyEmail,
          companyWebsiteUrl: shop!.companyWebsiteUrl,
          shopName: shop!.shopName,
          shopAddress: shop!.shopAddress,
          msiaStateId: shop!.msiaStateId,
          branchCode: shop!.branchCode,
          shopImageUrl: shop!.shopImageUrl,
          picName: shop!.picName,
          picPosition: shop!.picPosition,
          picContactNumber: shop!.picContactNumber,
          picEmail: shop!.picEmail,
          isActive: shop!.isActive,
        }
      : {
          companyName: "",
          companyRegistrationNumber: "",
          companyLicenseImageUrl: "",
          companyContactNumber: "",
          companyEmail: "",
          companyWebsiteUrl: "",
          shopName: "",
          shopAddress: "",
          msiaStateId: 0,
          branchCode: "",
          shopImageUrl: "",
          picName: "",
          picPosition: "",
          picContactNumber: "",
          picEmail: "",
          isActive: true,
        },
  });

  // Update form when shop data is available in edit mode
  useEffect(() => {
    if (isEditMode && shop && msiaStates.length > 0) {
      console.log(
        "Resetting form with msiaStateId:",
        shop.msiaStateId,
        typeof shop.msiaStateId
      );
      console.log("Company License URL:", shop.companyLicenseImageUrl);
      console.log("Shop Image URL:", shop.shopImageUrl);

      reset({
        id: shop.id,
        companyName: shop.companyName,
        companyRegistrationNumber: shop.companyRegistrationNumber,
        companyLicenseImageUrl: shop.companyLicenseImageUrl,
        companyContactNumber: shop.companyContactNumber,
        companyEmail: shop.companyEmail,
        companyWebsiteUrl: shop.companyWebsiteUrl,
        shopName: shop.shopName,
        shopAddress: shop.shopAddress,
        msiaStateId: Number(shop.msiaStateId),
        branchCode: shop.branchCode,
        shopImageUrl: shop.shopImageUrl,
        picName: shop.picName,
        picPosition: shop.picPosition,
        picContactNumber: shop.picContactNumber,
        picEmail: shop.picEmail,
        isActive: shop.isActive,
      });

      // Update image previews with existing URLs
      if (shop.companyLicenseImageUrl) {
        console.log(
          "Setting company license preview:",
          shop.companyLicenseImageUrl
        );
        setCompanyLicenseImagePreview(shop.companyLicenseImageUrl);
      }
      if (shop.shopImageUrl) {
        console.log("Setting shop image preview:", shop.shopImageUrl);
        setShopImagePreview(shop.shopImageUrl);
      }
    }
  }, [isEditMode, shop, msiaStates, reset]);

  // handle company license image change
  const handleCompanyLicenseImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingFileUpload({
          type: "companyLicense",
          file: file,
          preview: reader.result as string,
        });
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // handle shop image change
  const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingFileUpload({
          type: "shopImage",
          file: file,
          preview: reader.result as string,
        });
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // handle file upload confirmation
  const handleConfirmUpload = async () => {
    if (!pendingFileUpload) return;

    setIsUploading(true);
    // if uploading company license image, set folder to "company_licenses", else "shop_images"
    try {
      const uploadedUrl = await uploadFile(
        pendingFileUpload.file,
        pendingFileUpload.type === "companyLicense"
          ? "company_licenses"
          : "shop_images"
      );

      if (pendingFileUpload.type === "companyLicense") {
        setCompanyLicenseImagePreview(pendingFileUpload.preview);
        setValue("companyLicenseImageUrl", uploadedUrl);
        showToast("Company license image uploaded successfully!", "success");
      } else {
        setShopImagePreview(pendingFileUpload.preview);
        setValue("shopImageUrl", uploadedUrl);
        showToast("Shop image uploaded successfully!", "success");
      }

      setShowUploadModal(false);
      setPendingFileUpload(null);
    } catch (error: any) {
      showToast(
        `Upload failed: ${error.message || "An error occurred"}`,
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // handle file upload cancellation
  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setPendingFileUpload(null);

    // Reset file input
    if (
      pendingFileUpload?.type === "companyLicense" &&
      companyLicenseInputRef.current
    ) {
      companyLicenseInputRef.current.value = "";
    } else if (
      pendingFileUpload?.type === "shopImage" &&
      shopImageInputRef.current
    ) {
      shopImageInputRef.current.value = "";
    }
  };

  // handle company license image remove
  const handleRemoveCompanyLicenseImage = () => {
    setCompanyLicenseImagePreview(null);
    setValue("companyLicenseImageUrl", "");
    if (companyLicenseInputRef.current) {
      companyLicenseInputRef.current.value = "";
    }
  };

  // handle shop image remove
  const handleRemoveShopImage = () => {
    setShopImagePreview(null);
    setValue("shopImageUrl", "");
    if (shopImageInputRef.current) {
      shopImageInputRef.current.value = "";
    }
  };

  const msiaStateId = watch("msiaStateId");

  // handle branch code generation based on shop state (only in create mode)
  useEffect(() => {
    const fetchBranchCode = async () => {
      // Only generate branch code in create mode when state is selected
      if (!isEditMode && msiaStateId) {
        const selectedState = msiaStates.find(
          (s) => s.id === Number(msiaStateId)
        );
        if (selectedState) {
          try {
            const branchCode = await generateNextBranchCodeApi(
              selectedState.code
            );
            setValue("branchCode", branchCode);
          } catch (error) {
            console.error("Error generating branch code:", error);
            showToast("Failed to generate branch code", "error");
          }
        }
      }
    };
    fetchBranchCode();
  }, [msiaStateId, msiaStates, setValue, isEditMode, showToast]);

  const onSubmit: SubmitHandler<CreateShopRequest | UpdateShopRequest> = (
    data
  ) => {
    console.log("Form submitted with data:", data);
    console.log("Mode:", mode, "isEditMode:", isEditMode);
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);

    if (formData) {
      try {
        let result;

        if (isEditMode) {
          // Update shop with id - ensure all fields are included
          const updateData: UpdateShopRequest = {
            id: shop.id,
            companyName: formData.companyName,
            companyRegistrationNumber: formData.companyRegistrationNumber,
            companyLicenseImageUrl: formData.companyLicenseImageUrl,
            companyContactNumber: formData.companyContactNumber,
            companyEmail: formData.companyEmail,
            companyWebsiteUrl: formData.companyWebsiteUrl,
            shopName: formData.shopName,
            shopAddress: formData.shopAddress,
            msiaStateId: formData.msiaStateId,
            branchCode: formData.branchCode,
            shopImageUrl: formData.shopImageUrl,
            picName: formData.picName,
            picPosition: formData.picPosition,
            picContactNumber: formData.picContactNumber,
            picEmail: formData.picEmail,
            isActive: (formData as UpdateShopRequest).isActive,
          };
          console.log("Update data being sent:", updateData);
          result = await updateShopAction(updateData);
        } else {
          // Files are already uploaded, URLs are in formData
          const createData: CreateShopRequest = formData as CreateShopRequest;
          console.log("Create data being sent:", createData);
          result = await createShopAction(createData);
        }

        if (result && result.success) {
          showToast(
            `Shop ${isEditMode ? "updated" : "created"} successfully!`,
            "success"
          );
          setTimeout(() => {
            router.push("/admin/shops");
          }, 500);
        } else if (result) {
          showToast(`Error: ${result.error}`, "error");
        } else {
          showToast("An unexpected error occurred", "error");
        }
      } catch (error: any) {
        console.error("Error in handleConfirm:", error);
        showToast(
          `Error: ${error.message || "An unexpected error occurred"}`,
          "error"
        );
      }
    }
    setFormData(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setFormData(null);
  };

  const camelToNormalCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
            Shop Information
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
            Enter accurate shop information for warranty registration.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Company Name */}
            <div className="col-span-full">
              <label
                htmlFor="companyName"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Name
              </label>
              <div className="mt-2">
                <input
                  {...register("companyName", { required: true })}
                  id="companyName"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company Registration No. */}
            <div className="col-span-full">
              <label
                htmlFor="companyRegistrationNo"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Registration No.
              </label>
              <div className="mt-2">
                <input
                  {...register("companyRegistrationNumber", { required: true })}
                  id="companyRegistrationNumber"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company License Image */}
            <div className="col-span-full">
              <label
                htmlFor="companyLicenseImageUrl"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company License Image
              </label>
              <div className="mt-2 flex items-center gap-x-6">
                <div className="relative h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 bg-white dark:bg-gray-800 hover:border-primary/50 transition-colors overflow-hidden group">
                  <input
                    // {...(register("companyLicenseImageUrl"),
                    // {
                    //   required: true,
                    // })}
                    ref={companyLicenseInputRef}
                    id="companyLicenseImageUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyLicenseImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {companyLicenseImagePreview ? (
                    <div className="h-full w-full flex items-center justify-center p-2">
                      <Image
                        src={companyLicenseImagePreview}
                        alt="Company License preview"
                        width={128}
                        height={128}
                        className="max-h-full max-w-full object-contain"
                        crossOrigin="anonymous"
                        onLoad={() =>
                          console.log(
                            "Company license image loaded successfully"
                          )
                        }
                        onError={(e) => {
                          console.error(
                            "Failed to load company license image:",
                            companyLicenseImagePreview
                          );
                          console.error("Error event:", e);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                      <svg
                        className="h-10 w-10 text-gray-400 group-hover:text-primary/50 transition-colors"
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
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a clear image of the company's license document.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB. Click to browse or drag and drop.
                  </p>
                  {/* <input
                    // type="file"
                    {...(register("companyLicenseImageUrl"),
                    { required: true })}
                    // ref={companyLicenseInputRef}
                    id="companyLicenseImageUrl"
                    // no hidden
                    className="sr-only"
                  /> */}
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {companyLicenseImagePreview
                      ? "Image selected."
                      : "No image selected."}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {watch("companyLicenseImageUrl")
                      ? `Uploaded URL: ${watch("companyLicenseImageUrl")}`
                      : "No uploaded URL."}
                  </p>

                  {companyLicenseImagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveCompanyLicenseImage}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Company Contact No. */}
            <div className="col-span-full">
              <label
                htmlFor="companyContactNumber"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Contact No.
              </label>
              <div className="mt-2">
                <input
                  {...register("companyContactNumber", { required: true })}
                  id="companyContactNumber"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company Email */}
            <div className="col-span-full">
              <label
                htmlFor="companyEmail"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Email
              </label>
              <div className="mt-2">
                <input
                  {...register("companyEmail", { required: true })}
                  id="companyEmail"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Company Website */}
            <div className="col-span-full">
              <label
                htmlFor="companyWebsiteUrl"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Company Website
              </label>
              <div className="mt-2">
                <input
                  {...register("companyWebsiteUrl", { required: true })}
                  id="companyWebsiteUrl"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop Name */}
            <div className="col-span-full">
              <label
                htmlFor="shopName"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop Name
              </label>
              <div className="mt-2">
                <input
                  {...register("shopName", { required: true })}
                  id="shopName"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop Address */}
            <div className="col-span-full">
              <label
                htmlFor="shopAddress"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop Address
              </label>
              <div className="mt-2">
                <input
                  {...register("shopAddress", { required: true })}
                  id="shopAddress"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop State */}
            <div className="col-span-full">
              <label
                htmlFor="msiaStateId"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop State
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  {...register("msiaStateId", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  disabled={isEditMode}
                  id="msiaStateId"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                >
                  <option value={0}>Select a state</option>
                  {msiaStates.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                />
              </div>
              {/* display msiaStateId */}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Shop State ID: {shop?.msiaStateId} | Form Value:{" "}
                {watch("msiaStateId")} | Type: {typeof watch("msiaStateId")}
              </p>
            </div>

            {/* Branch Code */}
            <div className="col-span-full">
              <label
                htmlFor="branchCode"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Branch Code
              </label>
              <div className="mt-2">
                <input
                  {...register("branchCode", { required: true })}
                  disabled
                  id="branchCode"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Shop Image */}
            <div className="col-span-full">
              <label
                htmlFor="shopImage"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Shop Image
              </label>
              <div className="mt-2 flex items-center gap-x-6">
                <div className="relative h-32 w-32 rounded-lg border-2 border-dashed border-gray-300 bg-white dark:bg-gray-800 hover:border-primary/50 transition-colors overflow-hidden group">
                  <input
                    {...(register("shopImageUrl"),
                    {
                      required: false,
                    })}
                    ref={shopImageInputRef}
                    id="shopImage"
                    type="file"
                    accept="image/*"
                    onChange={handleShopImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {shopImagePreview ? (
                    <div className="h-full w-full flex items-center justify-center p-2">
                      <Image
                        src={shopImagePreview}
                        alt="Shop preview"
                        width={128}
                        height={128}
                        className="max-h-full max-w-full object-contain"
                        crossOrigin="anonymous"
                        onLoad={() =>
                          console.log("Shop image loaded successfully")
                        }
                        onError={(e) => {
                          console.error(
                            "Failed to load shop image:",
                            shopImagePreview
                          );
                          console.error("Error event:", e);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-2">
                      <svg
                        className="h-10 w-10 text-gray-400 group-hover:text-primary/50 transition-colors"
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
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a shop image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB. Click to browse or drag and drop.
                  </p>
                  {shopImagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveShopImage}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PIC Name */}
            <div className="col-span-full">
              <label
                htmlFor="picName"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Name
              </label>
              <div className="mt-2">
                <input
                  {...register("picName", { required: true })}
                  id="picName"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* PIC Position */}
            <div className="col-span-full">
              <label
                htmlFor="picPosition"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Position
              </label>
              <div className="mt-2">
                <input
                  id="picPosition"
                  {...register("picPosition", { required: true })}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* PIC Contact */}
            <div className="col-span-full">
              <label
                htmlFor="picContactNumber"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Contact
              </label>
              <div className="mt-2">
                <input
                  {...register("picContactNumber", { required: true })}
                  id="picContactNumber"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* PIC Email */}
            <div className="col-span-full">
              <label
                htmlFor="picEmail"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                PIC Email
              </label>
              <div className="mt-2">
                <input
                  {...register("picEmail", { required: true })}
                  id="picEmail"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Is Active - Only for update mode */}
            {isEditMode && (
              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900 dark:text-white mb-3">
                  Status
                </label>
                <div className="relative inline-flex items-center">
                  <label
                    htmlFor="isActive"
                    className="relative flex items-center cursor-pointer"
                  >
                    <input
                      {...register("isActive")}
                      id="isActive"
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 rounded-full peer-focus:ring-4 peer-focus:ring-primary/20 transition-colors duration-200 ease-in-out relative ${
                        watch("isActive")
                          ? "bg-primary"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                          watch("isActive") ? "left-6" : "left-1"
                        }`}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                      {watch("isActive") ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 cursor-pointer"
        >
          {isEditMode ? "Update Shop" : "Create Shop"}
        </button>
      </div>

      {/* Upload Confirmation Modal */}
      {showUploadModal && pendingFileUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm File Upload
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Do you want to upload this{" "}
                {pendingFileUpload.type === "companyLicense"
                  ? "company license"
                  : "shop"}{" "}
                image to the server?
              </p>
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <img
                  src={pendingFileUpload.preview}
                  alt="Preview"
                  className="max-h-48 max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                File: {pendingFileUpload.file.name} (
                {(pendingFileUpload.file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={handleCancelUpload}
                disabled={isUploading}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Shop Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(formData).map(([key, value]) => {
                // Skip displaying certain fields
                if (key === "loginPassword" || key === "id") return null;

                let displayValue = value;
                // Format state name
                if (key === "msiaStateId") {
                  const state = msiaStates.find((s) => s.id === Number(value));
                  displayValue = state?.name || value;
                }
                // Format boolean
                if (typeof value === "boolean") {
                  displayValue = value ? "Yes" : "No";
                }

                return (
                  <div key={key} className="col-span-2 sm:col-span-1">
                    <span className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {camelToNormalCase(key)}
                    </span>
                    <span className="block text-gray-900 dark:text-white wrap-break-word">
                      {String(displayValue) || "-"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
              >
                Confirm {isEditMode ? "Update" : "Create"}
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
      )}
    </form>
  );
}
