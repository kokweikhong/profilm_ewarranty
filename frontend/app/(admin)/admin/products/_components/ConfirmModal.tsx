"use client";

import {
  Product,
  ProductBrand,
  ProductType,
  ProductSeries,
  ProductName,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/productsType";
import { camelToNormalCase, removeIdSuffix } from "@/lib/utils";

type Props = {
  showConfirmModal: boolean;
  formData: CreateProductRequest | UpdateProductRequest;
  brands: ProductBrand[];
  types: ProductType[];
  series: ProductSeries[];
  names: ProductName[];
  handleConfirm: () => void;
  handleCancel: () => void;
};

export const ConfirmModal = ({
  showConfirmModal,
  formData,
  brands,
  types,
  series,
  names,
  handleConfirm,
  handleCancel,
}: Props) => {
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

  const removeIdSuffix = (str: string) => str.replace(/\s*Id$/, "");
  const camelToNormalCase = (str: string) =>
    str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Confirm Product Details
        </h3>
        <div className="space-y-3 text-sm">
          {/* don't show id */}
          {/* is Active = Active: Yes or No */}
          {Object.entries(formData)
            .filter(([key]) => key !== "id")
            .map(
              // if isActive, show Active: Yes or No
              ([key, value]) =>
                key === "isActive" ? (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {value ? "Yes" : "No"}
                    </span>
                  </div>
                ) : (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {removeIdSuffix(camelToNormalCase(key))}
                    </span>
                    <span className="text-gray-900 dark:text-white">
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
