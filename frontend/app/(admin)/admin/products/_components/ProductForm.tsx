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
} from "@/types/productsType";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/productsAction";
import { ConfirmModal } from "./ConfirmModal";

type Props = {
  product?: Product | null;
  brands: ProductBrand[];
  types: ProductType[];
  series: ProductSeries[];
  names: ProductName[];
  mode?: "create" | "update";
};

export default function ProductForm({
  product,
  brands,
  types,
  series,
  names,
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
          isActive: product.isActive,
        }
      : {
          isActive: true,
        },
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
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        formData={formData!}
        brands={brands}
        types={types}
        series={series}
        names={names}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
      />
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
                  Warranty (months)<span className="text-red-600">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <input
                    {...register("warrantyInMonths", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="warrantyInMonths"
                    type="number"
                    className="col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
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

              {/* Is Active */}
              <div className="col-span-full">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col">
                    <label
                      htmlFor="isActive"
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Product Status
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {mode === "create" || watch("isActive")
                        ? "Product is active and visible"
                        : "Product is inactive and hidden"}
                    </p>
                  </div>
                  <label
                    htmlFor="isActive"
                    className={`relative inline-flex items-center ${
                      mode === "create"
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    <input
                      {...register("isActive")}
                      id="isActive"
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={isEditMode ? product?.isActive : true}
                      disabled={mode === "create"}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {mode === "create" || watch("isActive")
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </label>
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
