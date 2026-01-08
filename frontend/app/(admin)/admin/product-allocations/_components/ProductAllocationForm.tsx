"use client";

import { useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import {
  CreateProductAllocationRequest,
  UpdateProductAllocationRequest,
} from "@/types/productAllocationsType";
import { ProductDetailResponse } from "@/types/productsType";
import { ProductAllocation } from "@/types/productAllocationsType";
import {
  createProductAllocationAction,
  updateProductAllocationAction,
} from "@/actions/productAllocationsAction";
import { camelToNormalCase } from "@/lib/utils";
import { Shop, ShopListResponse } from "@/types/shopsType";

type Props = {
  productAllocation?: ProductAllocation | null;
  products: ProductDetailResponse[];
  shops: ShopListResponse[];
  mode?: "create" | "update";
};

export default function ProductAllocationForm({
  productAllocation,
  products,
  shops,
  mode = "create",
}: Props) {
  const isEditMode = mode === "update" && productAllocation;
  console.log(
    "Product form mode:",
    mode,
    "Product Allocation:",
    productAllocation
  );
  const router = useRouter();
  const { showToast } = useToast();

  // Helper function to convert ISO date to YYYY-MM-DD format
  const formatDateForInput = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductAllocationRequest | UpdateProductAllocationRequest>({
    defaultValues: isEditMode
      ? {
          id: productAllocation!.id,
          productId: productAllocation!.productId,
          shopId: productAllocation!.shopId,
          filmQuantity: productAllocation!.filmQuantity,
          allocationDate: formatDateForInput(productAllocation!.allocationDate),
        }
      : undefined,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<
    CreateProductAllocationRequest | UpdateProductAllocationRequest | null
  >(null);

  // const [shopSearch, setShopSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");
  const filteredShops = shops
    .sort((a, b) => a.branchCode.localeCompare(b.branchCode))
    .filter(
      (shop) =>
        shop.branchCode.toLowerCase().includes(shopSearch.toLowerCase()) ||
        shop.shopName.toLowerCase().includes(shopSearch.toLowerCase())
    );

  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const shopInputRef = useRef<HTMLInputElement>(null);

  // To set the selected shopId when clicking an option
  const handleShopSelect = (shopId: number, shopLabel: string) => {
    setValue("shopId", shopId, { shouldValidate: true });
    setShopSearch(shopLabel);
    setShowShopDropdown(false);
    // Optionally, move focus away or blur input
    shopInputRef.current?.blur();
  };

  const onSubmit: SubmitHandler<
    CreateProductAllocationRequest | UpdateProductAllocationRequest
  > = (data) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);

    if (formData) {
      let result;

      if (isEditMode) {
        // Update product with id
        const updateData: UpdateProductAllocationRequest = {
          ...(formData as UpdateProductAllocationRequest),
          id: productAllocation!.id,
        };
        result = await updateProductAllocationAction(updateData);
      } else {
        // Create product without id
        const createData: CreateProductAllocationRequest =
          formData as CreateProductAllocationRequest;
        result = await createProductAllocationAction(createData);
      }

      if (result && result.success) {
        showToast(
          `Product Allocation ${
            isEditMode ? "updated" : "created"
          } successfully!`,
          "success"
        );
        setTimeout(() => {
          router.push("/admin/product-allocations");
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
        case "productId":
          const product = products.find((p) => p.id === Number(value));
          return product
            ? `${product.filmSerialNumber}\n${product.typeName}\n${product.seriesName}\n${product.productName}`
            : "N/A";
        case "shopId":
          const shop = shops.find((s) => s.id === Number(value));
          return shop ? `${shop.shopName} (${shop.branchCode})` : "N/A";
        default:
          return String(value);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white  rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-gray-900  mb-4">
            Confirm Product Details
          </h3>
          <div className="space-y-3 text-sm">
            {Object.entries(formData).map(([key, value]) =>
              // don't show id if contains id and don't show id
              key === "id" ? null : (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    {camelToNormalCase(key).split("Id")[0]}
                  </span>
                  <span className="text-gray-900  whitespace-pre-line">
                    {getDisplayValue(key, value)}
                  </span>
                </div>
              )
            )}
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

  return (
    <div>
      <ConfirmModal />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Product Allocation Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Enter accurate product allocation information for warranty
              registration.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Product ID */}
              <div className="col-span-full">
                <label
                  htmlFor="productId"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Product ID <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    {...register("productId", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    id="productId"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.filmSerialNumber}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>

              {/* Shop */}
              <div className="col-span-full">
                <label
                  htmlFor="shopSearch"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Shop <span className="text-red-600">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="shopSearch"
                    ref={shopInputRef}
                    type="text"
                    autoComplete="off"
                    value={shopSearch}
                    onChange={(e) => {
                      setShopSearch(e.target.value);
                      setShowShopDropdown(true);
                      // setValue("shopId", undefined); // clear selection
                    }}
                    onFocus={() => setShowShopDropdown(true)}
                    placeholder="Search shop by branch code or name..."
                    className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  {showShopDropdown && filteredShops.length > 0 && (
                    <ul
                      className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
                      tabIndex={-1}
                    >
                      {filteredShops.map((shop) => (
                        <li
                          key={shop.id}
                          className="cursor-pointer px-4 py-2 hover:bg-primary/10"
                          onMouseDown={() =>
                            handleShopSelect(
                              shop.id,
                              `${shop.branchCode} - ${shop.shopName}`
                            )
                          }
                        >
                          {shop.branchCode} - {shop.shopName}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Hidden input for react-hook-form */}
                  <input
                    type="hidden"
                    {...register("shopId", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </div>
                {errors.shopId && (
                  <p className="mt-2 text-sm text-red-600">Shop is required.</p>
                )}
              </div>

              {/* Film Quantity */}
              <div className="col-span-full">
                <label
                  htmlFor="filmQuantity"
                  className="block text-sm/6 font-medium text-gray-900"
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
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                {errors.filmQuantity && (
                  <p className="mt-2 text-sm text-red-600">
                    Film Quantity is required.
                  </p>
                )}
              </div>

              {/* Allocation Date */}
              <div className="col-span-full">
                <label
                  htmlFor="allocationDate"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Allocation Date <span className="text-red-600">*</span>
                </label>
                <div className="mt-2">
                  <input
                    {...register("allocationDate", {
                      required: true,
                    })}
                    id="allocationDate"
                    type="date"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary/60 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                {errors.allocationDate && (
                  <p className="mt-2 text-sm text-red-600">
                    Allocation Date is required.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 cursor-pointer"
          >
            {isEditMode
              ? "Update Product Allocation"
              : "Create Product Allocation"}
          </button>
        </div>
      </form>
    </div>
  );
}
