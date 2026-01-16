"use client";

import {
  CarPart,
  CreateWarrantyPartRequest,
  CreateWarrantyWithPartsRequest,
  UpdateWarrantyWithPartsRequest,
} from "@/types/warrantiesType";
import { FC } from "react";
import { FieldArrayMethodProps, FieldArrayWithId } from "react-hook-form";

type DuplicateProduct = {
  productAllocationId: number;
  brandName: string;
  typeName: string;
  seriesName: string;
  productName: string;
  filmSerialNumber: string;
};

type WarrantyPartsModalProps = {
  carParts: CarPart[];
  showCarPartsModal: boolean;
  setShowCarPartsModal: (show: boolean) => void;
  append: (
    value: CreateWarrantyPartRequest | CreateWarrantyPartRequest[],
    options?: FieldArrayMethodProps
  ) => void;
  remove: (index?: number | number[] | undefined) => void;
  isDuplicate?: boolean;
  duplicateProduct?: DuplicateProduct;
};

const WarrantyPartsModal: FC<WarrantyPartsModalProps> = (props) => {
  const {
    carParts,
    showCarPartsModal,
    setShowCarPartsModal,
    append,
    remove,
    isDuplicate,
    duplicateProduct,
  } = props;
  return (
    <>
      {showCarPartsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Select Car Parts</h3>
            {/* Show information for duplicate product */}
            {isDuplicate && duplicateProduct && (
              <div className="mb-4 p-4 border border-gray-300 rounded">
                <p>
                  <strong>Brand:</strong> {duplicateProduct.brandName}
                </p>
                <p>
                  <strong>Type:</strong> {duplicateProduct.typeName}
                </p>
                <p>
                  <strong>Series:</strong> {duplicateProduct.seriesName}
                </p>
                <p>
                  <strong>Name:</strong> {duplicateProduct.productName}
                </p>
                <p>
                  <strong>Film Serial Number:</strong>{" "}
                  {duplicateProduct.filmSerialNumber}
                </p>
              </div>
            )}
            <div className="max-h-72 overflow-y-auto space-y-2">
              {carParts.map((carPart, index) => {
                return (
                  <label
                    key={index}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      // ...
                      onChange={(e) => {
                        if (e.target.checked) {
                          append({
                            carPartId: carPart.id,
                            productAllocationId: isDuplicate
                              ? duplicateProduct!.productAllocationId
                              : 0,
                            installationImageUrl: "",
                          });
                        } else {
                          remove(index);
                        }
                      }}
                    />
                    <span className="font-medium">{carPart.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {carPart.code}
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80"
                onClick={() => setShowCarPartsModal(false)}
              >
                Done
              </button>
            </div>
            <button
              type="button"
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl cursor-pointer"
              onClick={() => setShowCarPartsModal(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WarrantyPartsModal;
