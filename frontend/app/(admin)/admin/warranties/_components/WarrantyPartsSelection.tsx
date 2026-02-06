"use client";

import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import {
  CarPart,
  CreateWarrantyPartRequest,
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
} from "@/types/warrantiesType";
import { Dispatch, FC, useEffect, useMemo, useState } from "react";
import {
  FieldArrayMethodProps,
  FieldArrayWithId,
  set,
  UseFormSetValue,
} from "react-hook-form";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import WarrantyPartsModal from "./WarrantyPartsModal";
import { cn } from "@/lib/utils";
import ProductSelect from "./ProductSelect";

export type DuplicateProduct = {
  productAllocationId: number;
  brandName: string;
  typeName: string;
  seriesName: string;
  productName: string;
  filmSerialNumber: string;
};

type Prop = {
  productsFromAllocation: ProductsFromAllocationByShopIdResponse[] | undefined;
  carParts: CarPart[];
  fields: FieldArrayWithId<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest,
    "parts",
    "id"
  >[];
  handleImageSelect: (fieldIdx: number, file: File) => void;
  imagePreview: Map<number, string>;
  setImagePreview: Dispatch<React.SetStateAction<Map<number, string>>>;
  toggleCarPart: (carPartId: number, carPartName: string) => void;
  setValue: UseFormSetValue<
    CreateWarrantyWithPartsRequest | UpdateWarrantyWithPartsRequest
  >;
  append: (
    value: CreateWarrantyPartRequest | CreateWarrantyPartRequest[],
    options?: FieldArrayMethodProps,
  ) => void;
  remove: (index?: number | number[] | undefined) => void;
  fileInputKey: number;
};

const WarrantyPartsSelection: FC<Prop> = ({
  productsFromAllocation,
  carParts,
  fields,
  handleImageSelect,
  imagePreview,
  setImagePreview,
  toggleCarPart,
  setValue,
  append,
  remove,
  fileInputKey,
}) => {
  const [showCarPartsModal, setShowCarPartsModal] = useState(false);
  const [isDuplicateMode, setIsDuplicateMode] = useState<boolean>(false);
  const [duplicateProduct, setDuplicateProduct] =
    useState<DuplicateProduct | null>(null);

  // const [imagePreview, setImagePreview] = useState<Map<number, string>>(
  //   new Map()
  // );
  const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(
    new Map(),
  );
  const [imageFileSizeErrors, setImageFileSizeErrors] = useState<
    Map<number, boolean>
  >(new Map());

  return (
    <>
      {/* Car Parts Selection */}
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-lg font-semibold text-gray-900  mb-2">
          Car Parts Selection
        </h2>
        <p className="text-sm text-gray-600  mb-6">
          Select car parts and provide details for each
        </p>

        {/* Button to open modal */}
        <button
          type="button"
          className="mb-4 px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80"
          onClick={() => {
            setIsDuplicateMode(false);
            setShowCarPartsModal(true);
          }}
        >
          Select Car Parts
        </button>

        {/* Modal for car part selection */}
        <WarrantyPartsModal
          carParts={carParts}
          showCarPartsModal={showCarPartsModal}
          setShowCarPartsModal={setShowCarPartsModal}
          append={append}
          remove={remove}
          isDuplicate={isDuplicateMode}
          duplicateProduct={
            isDuplicateMode && duplicateProduct?.productAllocationId !== null
              ? {
                  productAllocationId: duplicateProduct?.productAllocationId!,
                  brandName: duplicateProduct?.brandName!,
                  typeName: duplicateProduct?.typeName!,
                  seriesName: duplicateProduct?.seriesName!,
                  productName: duplicateProduct?.productName!,
                  filmSerialNumber: duplicateProduct?.filmSerialNumber!,
                }
              : undefined
          }
        />

        {/* Show selected car parts and their details */}
        <div className="space-y-4">
          {fields.length === 0 && (
            <p className="mt-4 text-sm text-red-600">
              Please select at least one car part.
            </p>
          )}
          {fields.map((field, idx) => {
            const carPart = carParts.find((cp) => cp.id === field.carPartId);
            if (!carPart) return null;
            return (
              <div
                key={field.id}
                className="border rounded-lg p-4 border-primary bg-primary/5"
              >
                <div className="flex flex-col items-start gap-3 w-full">
                  <div className="w-full flex justify-between items-start flex-wrap">
                    <div className="flex flex-col basis-3/4">
                      <p className="block font-medium text-gray-900">
                        {carPart.name} ({carPart.code})
                      </p>
                      {carPart.description && (
                        <p className="text-sm text-gray-500  mt-1">
                          {carPart.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-4 w-full">
                    {/* TODO: Need to fix can't remove last item issue */}
                    {/* PRODUCT SELECT */}
                    <div key={field.id}>
                      <ProductSelect
                        fields={fields}
                        field={field}
                        fieldIndex={idx}
                        productsFromAllocation={productsFromAllocation!}
                        setValue={setValue}
                        setIsDuplicateMode={setIsDuplicateMode}
                        setShowCarPartsModal={setShowCarPartsModal}
                        remove={remove}
                        setDuplicateProduct={setDuplicateProduct}
                      />
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Installation Image{""}
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="mt-2">
                        {selectedFiles.has(idx) && (
                          <div className="mb-2">
                            <p
                              className={`text-xs ${
                                imageFileSizeErrors.get(idx)
                                  ? "text-red-600 font-semibold"
                                  : "text-gray-500"
                              }`}
                            >
                              File size:{" "}
                              {(
                                selectedFiles.get(idx)!.size /
                                1024 /
                                1024
                              ).toFixed(2)}{" "}
                              MB
                              {imageFileSizeErrors.get(idx) &&
                                " - Exceeds 50MB limit!"}
                            </p>
                          </div>
                        )}
                        <div className="relative w-full h-64 sm:h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50  hover:border-primary/50 transition-colors overflow-hidden group">
                          <input
                            key={`${fileInputKey}-${field.id}`}
                            type="file"
                            id={`image-upload-${field.id}`}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageSelect(idx, file);
                                setValue(
                                  `parts.${idx}.installationImageUrl`,
                                  "Pending Upload",
                                );
                                e.target.value = "";
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          {imagePreview.get(idx) ||
                          fields[idx]?.installationImageUrl ? (
                            <>
                              <img
                                src={
                                  imagePreview.get(idx) ||
                                  fields[idx]?.installationImageUrl
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WarrantyPartsSelection;
