"use client";

import { useRef, useState, useMemo, useEffect } from "react";
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

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");

  // Extract unique brands
  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brandName))),
    [products]
  );

  // Filter types by brand
  const types = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .filter((p) => p.brandName === selectedBrand)
            .map((p) => p.typeName)
        )
      ),
    [products, selectedBrand]
  );

  // Filter series by brand and type
  const series = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .filter(
              (p) =>
                p.brandName === selectedBrand && p.typeName === selectedType
            )
            .map((p) => p.seriesName)
        )
      ),
    [products, selectedBrand, selectedType]
  );

  // Filter names by brand, type, and series
  const names = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .filter(
              (p) =>
                p.brandName === selectedBrand &&
                p.typeName === selectedType &&
                p.seriesName === selectedSeries
            )
            .map((p) => p.productName)
        )
      ),
    [products, selectedBrand, selectedType, selectedSeries]
  );

  // Film serial numbers: show all unless filtered
  const filmSerialNumbers = useMemo(() => {
    // If type, series, or name is selected, filter
    if (selectedType || selectedSeries || selectedName) {
      return products.filter(
        (p) =>
          (!selectedType || p.typeName === selectedType) &&
          (!selectedSeries || p.seriesName === selectedSeries) &&
          (!selectedName || p.productName === selectedName) &&
          (selectedBrand ? p.brandName === selectedBrand : true)
      );
    }
    // Otherwise, show all
    return products;
  }, [products, selectedBrand, selectedType, selectedSeries, selectedName]);

  const shopDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target as Node)
      ) {
        setShowShopDropdown(false);
      }
    }
    if (showShopDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShopDropdown]);

  // When film serial number is selected, auto-select type, series, name
  const handleFilmSerialSelect = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedBrand(product.brandName);
      setSelectedType(product.typeName);
      setSelectedSeries(product.seriesName);
      setSelectedName(product.productName);
      setValue("productId", productId, { shouldValidate: true });
    }
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
              {/* Product Selection */}
              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Brand <span className="text-red-600">*</span>
                </label>
                <div className="form-select-container mt-2">
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setSelectedType("");
                      setSelectedSeries("");
                      setSelectedName("");
                      // setValue("productId", null);
                    }}
                    className="form-select"
                  >
                    <option value="" disabled>
                      Select a brand
                    </option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="form-select-chevron-down"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Type <span className="text-red-600">*</span>
                </label>
                <div className="form-select-container mt-2">
                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setSelectedSeries("");
                      setSelectedName("");
                    }}
                    className="form-select"
                  >
                    <option value="">Select a type</option>
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="form-select-chevron-down"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Series <span className="text-red-600">*</span>
                </label>
                <div className="form-select-container mt-2">
                  <select
                    value={selectedSeries}
                    onChange={(e) => {
                      setSelectedSeries(e.target.value);
                      setSelectedName("");
                    }}
                    className="form-select"
                  >
                    <option value="">Select a series</option>
                    {series.map((seriesName) => (
                      <option key={seriesName} value={seriesName}>
                        {seriesName}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="form-select-chevron-down"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <div className="form-select-container mt-2">
                  <select
                    value={selectedName}
                    onChange={(e) => {
                      setSelectedName(e.target.value);
                    }}
                    className="form-select"
                  >
                    <option value="">Select a product name</option>
                    {names.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="form-select-chevron-down"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Film Serial Number <span className="text-red-600">*</span>
                </label>
                <div className="form-select-container mt-2">
                  <select
                    value={watch("productId") ?? ""}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      handleFilmSerialSelect(val);
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">Select a film serial number</option>
                    {filmSerialNumbers.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.filmSerialNumber}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="form-select-chevron-down"
                  />
                </div>
              </div>

              {/* Shop */}
              <div className="col-span-full" ref={shopDropdownRef}>
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
