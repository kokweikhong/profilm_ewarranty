"use client";

import { FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
} from "@/types/warrantiesType";
import { FieldArrayWithId, set, UseFormSetValue } from "react-hook-form";
import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import { cn } from "@/lib/utils";
import { DuplicateProduct } from "./WarrantyPartsSelection";

type ProductSelectProps = {
  fields: FieldArrayWithId<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest,
    "parts",
    "id"
  >[];
  field: FieldArrayWithId<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest,
    "parts",
    "id"
  >;
  fieldIndex: number;
  productsFromAllocation: ProductsFromAllocationByShopIdResponse[] | undefined;
  setValue: UseFormSetValue<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest
  >;
  setIsDuplicateMode: (value: SetStateAction<boolean>) => void;
  remove: (index?: number | number[] | undefined) => void;
  setShowCarPartsModal: (value: SetStateAction<boolean>) => void;
  setDuplicateProduct: (value: SetStateAction<DuplicateProduct | null>) => void;
};

const ProductSelect: FC<ProductSelectProps> = ({
  field,
  fieldIndex,
  productsFromAllocation,
  setValue,
  setIsDuplicateMode,
  remove,
  setShowCarPartsModal,
  setDuplicateProduct,
  fields,
}) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [series, setSeries] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [filmSerialNumbers, setFilmSerialNumbers] = useState<
    ProductsFromAllocationByShopIdResponse[]
  >([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    field.productAllocationId || null,
  );

  console.log(
    "Rendering ProductSelect for field index:",
    field.productAllocationId,
  );

  // Extract unique brands
  // const brands = useMemo(
  //   () => Array.from(new Set(productsFromAllocation?.map((p) => p.brandName))),
  //   [productsFromAllocation],
  // );

  // Filter types by brand
  // const types = useMemo(
  //   () =>
  //     Array.from(
  //       new Set(
  //         productsFromAllocation!
  //           .filter((p) => p.brandName === selectedBrand)
  //           .map((p) => p.typeName),
  //       ),
  //     ),
  //   [productsFromAllocation, selectedBrand],
  // );

  // Filter series by brand and type
  // const series = useMemo(
  //   () =>
  //     Array.from(
  //       new Set(
  //         productsFromAllocation!
  //           .filter(
  //             (p) =>
  //               p.brandName === selectedBrand && p.typeName === selectedType,
  //           )
  //           .map((p) => p.seriesName),
  //       ),
  //     ),
  //   [productsFromAllocation, selectedBrand, selectedType],
  // );

  // Filter names by brand, type, and series
  // const names = useMemo(
  //   () =>
  //     Array.from(
  //       new Set(
  //         productsFromAllocation!
  //           .filter(
  //             (p) =>
  //               p.brandName === selectedBrand &&
  //               p.typeName === selectedType &&
  //               p.seriesName === selectedSeries,
  //           )
  //           .map((p) => p.productName),
  //       ),
  //     ),
  //   [productsFromAllocation, selectedBrand, selectedType, selectedSeries],
  // );

  // Film serial numbers: show all unless filtered
  // const filmSerialNumbers = useMemo(() => {
  //   // If type, series, or name is selected, filter
  //   if (selectedType || selectedSeries || selectedName) {
  //     return productsFromAllocation!.filter(
  //       (p) =>
  //         (!selectedType || p.typeName === selectedType) &&
  //         (!selectedSeries || p.seriesName === selectedSeries) &&
  //         (!selectedName || p.productName === selectedName) &&
  //         (selectedBrand ? p.brandName === selectedBrand : true),
  //     );
  //   }
  //   // Otherwise, show all
  //   return productsFromAllocation!;
  // }, [
  //   productsFromAllocation,
  //   selectedBrand,
  //   selectedType,
  //   selectedSeries,
  //   selectedName,
  // ]);

  useEffect(() => {
    console.log("Field productAllocationId:", field.productAllocationId);
    // Initialize selected values based on field data

    // unique brands
    const brands = Array.from(
      new Set(productsFromAllocation?.map((p) => p.brandName)),
    );
    setBrands(brands);

    // unique types
    const types = Array.from(
      new Set(
        // filter by selected brand
        productsFromAllocation!
          .filter((p) => (selectedBrand ? p.brandName === selectedBrand : true))
          .map((p) => p.typeName),
      ),
    );

    setTypes(types);
    const series = Array.from(
      new Set(
        // filter by selected brand and type
        productsFromAllocation!
          .filter((p) => (selectedBrand ? p.brandName === selectedBrand : true))
          .filter((p) => (selectedType ? p.typeName === selectedType : true))
          .map((p) => p.seriesName),
      ),
    );
    setSeries(series);
    const names = Array.from(
      new Set(
        // filter by selected brand, type, and series
        productsFromAllocation!
          .filter((p) => (selectedBrand ? p.brandName === selectedBrand : true))
          .filter((p) => (selectedType ? p.typeName === selectedType : true))
          .filter((p) =>
            selectedSeries ? p.seriesName === selectedSeries : true,
          )
          .map((p) => p.productName),
      ),
    );
    setNames(names);

    // unique film serial numbers based on filters
    const filmSerialNumbers = Array.from(
      new Map(
        productsFromAllocation!
          .filter((p) => (selectedBrand ? p.brandName === selectedBrand : true))
          .filter((p) => (selectedType ? p.typeName === selectedType : true))
          .filter((p) =>
            selectedSeries ? p.seriesName === selectedSeries : true,
          )
          .filter((p) => (selectedName ? p.productName === selectedName : true))
          .map((p) => [p.filmSerialNumber, p]),
      ).values(),
    );
    setFilmSerialNumbers(filmSerialNumbers);

    console.log(
      "Updated film serial numbers:",
      field.productAllocationId,
      filmSerialNumbers,
    );
    if (field.productAllocationId) {
      const selectedProduct = productsFromAllocation?.find(
        (p) => p.productAllocationId === field.productAllocationId,
      );
      if (selectedProduct) {
        setSelectedBrand(selectedProduct.brandName);
        setSelectedType(selectedProduct.typeName);
        setSelectedSeries(selectedProduct.seriesName);
        setSelectedName(selectedProduct.productName);
        setFilmSerialNumbers(
          selectedProduct.filmSerialNumber ? [selectedProduct] : [],
        );
        setSelectedProductId(selectedProduct.productAllocationId);
      }
    }
  }, [
    field.productAllocationId,
    productsFromAllocation,
    selectedBrand,
    selectedType,
    selectedSeries,
    selectedName,
  ]);

  return (
    <div>
      <div className="flex flex-col mt-4 w-full justify-start items-center">
        {/* Duplicate Button */}
        <div className="flex items-center justify-start w-full">
          <button
            type="button"
            className={cn(
              "px-2 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 cursor-pointer",
              !selectedProductId ? "opacity-50 cursor-not-allowed" : "",
            )}
            disabled={!selectedProductId}
            onClick={() => {
              console.log("Set duplicate product:", selectedProductId);
              if (selectedProductId === null) return;
              const selectedProduct = filmSerialNumbers.find(
                (p) => p.productAllocationId === selectedProductId,
              );
              if (!selectedProduct) return;
              setDuplicateProduct({
                productAllocationId: selectedProductId,
                brandName: selectedBrand,
                typeName: selectedType,
                seriesName: selectedSeries,
                productName: selectedName,
                filmSerialNumber: selectedProduct.filmSerialNumber,
              });
              setIsDuplicateMode(true);
              setShowCarPartsModal(true);
            }}
            title="Duplicate this car part selection"
          >
            Duplicate
          </button>

          {/* Remove Button */}
          <button
            type="button"
            className="ml-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 cursor-pointer"
            onClick={() => {
              console.log(fields.length);
              if (fields.length === 1) {
                // Remove the last part and set parts to empty array
                // setValue("parts", [], {
                //   shouldDirty: true,
                //   shouldValidate: true,
                // });
                remove();
              } else {
                remove(fieldIndex);
              }
            }}
          >
            Remove
          </button>

          {/* reset film serial number */}
          <div className="ml-2">
            <button
              type="button"
              className="px-2 py-1 rounded bg-gray-500 text-white text-xs font-semibold hover:bg-gray-600 cursor-pointer"
              onClick={() => {
                setSelectedProductId(null);
                setSelectedBrand("");
                setSelectedType("");
                setSelectedSeries("");
                setSelectedName("");
                setValue(`parts.${fieldIndex}.productAllocationId`, 0);
              }}
            >
              Reset Product
            </button>
          </div>
        </div>
        {selectedProductId === null && (
          <div className="w-full mt-1 flex justify-start">
            <span className="block text-xs text-red-600">
              Please select a product to duplicate.
            </span>
          </div>
        )}
      </div>
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
            value={selectedProductId ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSelectedProductId(val);
              setValue(`parts.${fieldIndex}.productAllocationId`, val);
              const selectedProduct = filmSerialNumbers.find(
                (p) => p.productAllocationId === val, // <-- FIXED HERE
              );
              setSelectedBrand(
                selectedProduct ? selectedProduct.brandName : "",
              );
              setSelectedType(selectedProduct ? selectedProduct.typeName : "");
              setSelectedSeries(
                selectedProduct ? selectedProduct.seriesName : "",
              );
              setSelectedName(
                selectedProduct ? selectedProduct.productName : "",
              );
            }}
            className="form-select"
            required
          >
            <option value="">Select a film serial number</option>
            {filmSerialNumbers.map((product, index) => (
              <option key={index} value={product.productAllocationId}>
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
    </div>
  );
};

export default ProductSelect;
