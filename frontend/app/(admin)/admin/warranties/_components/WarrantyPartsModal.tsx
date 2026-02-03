"use client";

import { useState } from "react";
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
    options?: FieldArrayMethodProps,
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

  // Track selected car part IDs
  const [selectedParts, setSelectedParts] = useState<number[]>([]);

  const handleCheckboxChange = (carPartId: number, checked: boolean) => {
    setSelectedParts((prev) =>
      checked ? [...prev, carPartId] : prev.filter((id) => id !== carPartId),
    );
  };

  const handleDone = () => {
    selectedParts.forEach((carPartId) => {
      append({
        carPartId,
        productAllocationId: isDuplicate
          ? duplicateProduct!.productAllocationId
          : 0,
        installationImageUrl: "",
      });
    });
    setShowCarPartsModal(false);
    setSelectedParts([]); // Reset selection
  };

  return (
    <>
      {showCarPartsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Select Car Parts</h3>
            {/* ...duplicate info... */}
            <div className="max-h-72 overflow-y-auto space-y-2">
              {carParts.map((carPart, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={selectedParts.includes(carPart.id)}
                    onChange={(e) =>
                      handleCheckboxChange(carPart.id, e.target.checked)
                    }
                  />
                  <span className="font-medium">{carPart.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {carPart.code}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80"
                onClick={handleDone}
              >
                Done
              </button>
            </div>
            <button
              type="button"
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl cursor-pointer"
              onClick={() => {
                setShowCarPartsModal(false);
                setSelectedParts([]);
              }}
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
