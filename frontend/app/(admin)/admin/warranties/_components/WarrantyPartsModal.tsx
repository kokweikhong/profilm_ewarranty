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
import { CarPartsCombination } from "./CarPartsCombination";
import { CAR_PARTS_COMBINATIONS } from "@/constants/carParts";

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
  const carPartsCombinationTitle: string[] = [
    "Full Car Tinting (MPV)",
    "Full Car Tinting (SUV)",
    "Full Car Tinting (Compact)",
    "Full Front Tinting",
  ];

  const [selectedParts, setSelectedParts] = useState<number[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [showTitleModal, setShowTitleModal] = useState<boolean>(false);
  const [selectedCombination, setSelectedCombination] = useState<string | null>(
    null,
  );

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

  const handleCombinationClick = (title: string) => {
    setSelectedCombination(title);
    setSelectedParts([]);
    const combination = CAR_PARTS_COMBINATIONS.find(
      (comb) => comb.title === title,
    );
    if (combination) {
      const partCodes = combination.parts.map((part) => part.code);
      const selectedCarPartIds = carParts
        .filter((part) => partCodes.includes(part.code))
        .map((part) => part.id);
      setSelectedParts(selectedCarPartIds);
    }
  };

  return (
    <>
      {showCarPartsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Select Car Parts</h3>

            {/* Show title from CarPartsCombination */}
            <div className="mb-4 p-3 rounded bg-gray-50 border border-gray-200">
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  <b>Total Parts:</b> {carParts.length}
                </p>
                <p>
                  <b>Selected:</b> {selectedParts.length}
                </p>
              </div>
            </div>

            {/* Car parts combination title */}
            <div className="mb-4 p-3 rounded bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2 italic">
                Tips: Click to view car parts combinations
              </p>
              <div className="mt-2 text-sm text-gray-600">
                <CarPartsCombination
                  selectedTitle={selectedTitle}
                  setSelectedTitle={setSelectedTitle}
                  showTitleModal={showTitleModal}
                  setShowTitleModal={setShowTitleModal}
                />
                {carPartsCombinationTitle.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer transition hover:bg-gray-100"
                  >
                    {/* input to select car parts combination */}
                    {/* if selected, also select car parts with same combination */}
                    <input
                      type="checkbox"
                      checked={selectedTitle === title}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleCombinationClick(title);
                          setSelectedTitle(title);
                        } else {
                          setSelectedTitle(null);
                          setSelectedParts([]);
                        }
                      }}
                      className="mr-2 cursor-pointer"
                    />

                    <button
                      key={index}
                      type="button"
                      className="cursor-pointer text-sm text-primary font-medium underline underline-offset-2 hover:text-primary/80 mr-4 mb-2"
                      onClick={() => {
                        setSelectedTitle(title);
                        setShowTitleModal(true);
                      }}
                    >
                      {title}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ...duplicate info... */}
            {isDuplicate && duplicateProduct && (
              <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200 text-sm text-blue-900">
                <div>
                  <b>Brand:</b> {duplicateProduct.brandName}
                </div>
                <div>
                  <b>Type:</b> {duplicateProduct.typeName}
                </div>
                <div>
                  <b>Series:</b> {duplicateProduct.seriesName}
                </div>
                <div>
                  <b>Product Name:</b> {duplicateProduct.productName}
                </div>
                <div>
                  <b>Film Serial Number:</b> {duplicateProduct.filmSerialNumber}
                </div>
              </div>
            )}
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
