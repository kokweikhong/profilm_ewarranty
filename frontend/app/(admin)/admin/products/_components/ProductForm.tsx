"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import {
  UpdateProductRequest,
  CreateProductRequest,
} from "@/types/productsType";
import {
  Product,
  ProductBrand,
  ProductType,
  ProductSeries,
  ProductName,
  WarrantyPeriod,
} from "@/types/productsType";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/productsAction";
import { camelToNormalCase } from "@/lib/utils";

type Props = {
  product?: Product | null;
  brands: ProductBrand[];
  types: ProductType[];
  series: ProductSeries[];
  names: ProductName[];
  warranties: WarrantyPeriod[];
  mode?: "create" | "update";
};

export default function ProductForm({
  product,
  brands,
  types,
  series,
  names,
  warranties,
  mode = "create",
}: Props) {
  const isEditMode = mode === "update" && product;
  console.log("Product form mode:", mode, "Product:", product);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductRequest | UpdateProductRequest>({
    defaultValues: isEditMode
      ? {
          id: product.id,
          brandId: product.brandId,
          typeId: product.typeId,
          seriesId: product.seriesId,
          nameId: product.nameId,
          warrantyInMonths: product.warrantyInMonths,
          filmSerialNumber: product.filmSerialNumber,
          filmQuantity: product.filmQuantity,
          shipmentNumber: product.shipmentNumber,
          description: product.description,
        }
      : undefined,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<
    CreateProductRequest | UpdateProductRequest | null
  >(null);

  const selectedBrandId = watch("brandId");
  const selectedTypeId = watch("typeId");
  const selectedSeriesId = watch("seriesId");

  // Filter types based on selected brand
  const filteredTypes = selectedBrandId
    ? types.filter((type) => type.brandId === selectedBrandId)
    : [];

  // Filter series based on selected type
  const filteredSeries = selectedTypeId
    ? series.filter((ser) => ser.typeId === selectedTypeId)
    : [];

  // Filter names based on selected series
  const filteredNames = selectedSeriesId
    ? names.filter((name) => name.seriesId === selectedSeriesId)
    : [];

  const onSubmit: SubmitHandler<CreateProductRequest | UpdateProductRequest> = (
    data
  ) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);

    if (formData) {
      let result;

      if (isEditMode) {
        // Update product with id
        const updateData: UpdateProductRequest = {
          ...(formData as UpdateProductRequest),
          id: product.id,
        };
        result = await updateProductAction(updateData);
      } else {
        // Create product without id
        const createData: CreateProductRequest =
          formData as CreateProductRequest;
        result = await createProductAction(createData);
      }

      if (result && result.success) {
        showToast(
          `Product ${isEditMode ? "updated" : "created"} successfully!`,
          "success"
        );
        setTimeout(() => {
          router.push("/admin/products");
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
  };

  // Add this modal JSX before the closing form tag
  const ConfirmModal = () => {
    if (!showConfirmModal || !formData) return null;

    const getDisplayValue = (key: string, value: any) => {
      switch (key) {
        case "brandId":
          return brands.find((b) => b.id === value)?.name || value;
        case "typeId":
          return types.find((t) => t.id === value)?.name || value;
        case "seriesId":
          return series.find((s) => s.id === value)?.name || value;
        case "nameId":
          return names.find((n) => n.id === value)?.name || value;
        case "warrantyInMonths":
          return `${value} months`;
        default:
          return String(value);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Confirm Product Details
          </h3>
          <div className="space-y-3 text-sm">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {camelToNormalCase(key)}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {getDisplayValue(key, value)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/50"
            >
              Confirm
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // reset names, series, types when brand changes
  // reset series and names when type changes
  // reset names when series changes
  // not in initial render
  useEffect(() => {
    if (isEditMode && selectedBrandId === product.brandId) return;
    if (!isEditMode && !selectedBrandId) return;
    setValue("typeId", "" as any);
    setValue("seriesId", "" as any);
    setValue("nameId", "" as any);
  }, [selectedBrandId, setValue, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedTypeId === product.typeId) return;
    if (!isEditMode && !selectedTypeId) return;
    setValue("seriesId", "" as any);
    setValue("nameId", "" as any);
  }, [selectedTypeId, setValue, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedSeriesId === product.seriesId) return;
    if (!isEditMode && !selectedSeriesId) return;
    setValue("nameId", "" as any);
  }, [selectedSeriesId, setValue, isEditMode]);

  return (
    <div>
      <ConfirmModal />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
            <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
              Product Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
              Enter accurate product information for warranty registration.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Brand */}
              <div className="col-span-full">
                <label
                  htmlFor="brandId"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Brand <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    {...register("brandId", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="brandId"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="col-span-full">
                <label
                  htmlFor="typeId"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Type <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    {...register("typeId", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="typeId"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                  >
                    <option value="">Select a type</option>
                    {filteredTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                  />
                </div>
              </div>

              {/* Series */}
              <div className="col-span-full">
                <label
                  htmlFor="seriesId"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Series <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    {...register("seriesId", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="seriesId"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                  >
                    <option value="">Select a series</option>
                    {filteredSeries.map((series) => (
                      <option key={series.id} value={series.id}>
                        {series.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="col-span-full">
                <label
                  htmlFor="nameId"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Name <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    {...register("nameId", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="nameId"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                  >
                    <option value="">Select a name</option>
                    {filteredNames.map((name) => (
                      <option key={name.id} value={name.id}>
                        {name.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                  />
                </div>
                {errors.nameId && (
                  <p className="mt-2 text-sm text-red-600">
                    Product Name is required.
                  </p>
                )}
              </div>

              {/* Warranty */}
              <div className="col-span-full">
                <label
                  htmlFor="warrantyInMonths"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Warranty <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    {...register("warrantyInMonths", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="warrantyInMonths"
                    name="warrantyInMonths"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus:outline-primary/50"
                  >
                    <option value="">Select a warranty</option>
                    {warranties.map((warranty) => (
                      <option key={warranty.id} value={warranty.periodYears}>
                        {warranty.periodYears} months
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                  />
                </div>
                {errors.warrantyInMonths && (
                  <p className="mt-2 text-sm text-red-600">
                    Warranty period is required.
                  </p>
                )}
              </div>

              {/* Film Serial No */}
              <div className="col-span-full">
                <label
                  htmlFor="filmSerialNumber"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Film Serial No. <span className="text-red-600">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("filmSerialNumber", { required: true })}
                    id="filmSerialNumber"
                    name="filmSerialNumber"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                {errors.filmSerialNumber && (
                  <p className="mt-2 text-sm text-red-600">
                    Film Serial Number is required.
                  </p>
                )}
              </div>

              {/* Film Quantity */}
              <div className="col-span-full">
                <label
                  htmlFor="filmQuantity"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Film Quantity <span className="text-red-600">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("filmQuantity", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="filmQuantity"
                    name="filmQuantity"
                    type="number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                {errors.filmQuantity && (
                  <p className="mt-2 text-sm text-red-600">
                    Film Quantity is required.
                  </p>
                )}
              </div>

              {/* Shipment No. */}
              <div className="col-span-full">
                <label
                  htmlFor="shipmentNumber"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Shipment No.
                </label>
                <div className="mt-2">
                  <input
                    {...register("shipmentNumber")}
                    id="shipmentNumber"
                    name="shipmentNumber"
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    {...register("description")}
                    id="description"
                    name="description"
                    rows={4}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 cursor-pointer"
          >
            {isEditMode ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
