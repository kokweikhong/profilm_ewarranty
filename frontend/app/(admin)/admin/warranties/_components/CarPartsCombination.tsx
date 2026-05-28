"use client";

import { FC, useMemo, useState } from "react";
import { CAR_PARTS_COMBINATIONS } from "@/constants/carParts";

type CarPartCombinationProps = {
  selectedTitle: string | null;
  setSelectedTitle: (title: string | null) => void;
  showTitleModal: boolean;
  setShowTitleModal: (show: boolean) => void;
};

export const CarPartsCombination: FC<CarPartCombinationProps> = ({
  selectedTitle,
  setSelectedTitle,
  showTitleModal,
  setShowTitleModal,
}) => {
  const selectedCombination = useMemo(
    () =>
      CAR_PARTS_COMBINATIONS.find(
        (combination) => combination.title === selectedTitle,
      ) ?? null,
    [selectedTitle],
  );

  return (
    <>
      {selectedCombination && showTitleModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">
              {selectedCombination.title}
            </h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700 max-h-80 overflow-y-auto">
              {selectedCombination.parts.map((part) => (
                <li key={part.code}>{part.name}</li>
              ))}
            </ol>
            <button
              type="button"
              className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl cursor-pointer"
              onClick={() => {
                setSelectedTitle(null);
                setShowTitleModal(false);
              }}
              aria-label="Close details"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};
