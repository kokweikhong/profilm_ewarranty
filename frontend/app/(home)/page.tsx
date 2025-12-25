"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([
    {
      warrantyId: 1,
      warrantyNo: "WRN-2024-001",
      clientName: "Ahmad bin Abdullah",
      clientContact: "+60123456789",
      clientEmail: "ahmad.abdullah@email.com",
      carBrand: "Toyota",
      carModel: "Vios",
      carPlateNo: "WXY1234",
      carChassisNo: "JTDBR32E300012345",
      shopName: "ProFilm KL Central",
      branchCode: "KL-001",
      installationDate: "2024-01-15T00:00:00Z",
      warrantyParts: [
        {
          id: 1,
          warrantyId: 1,
          carPartId: 1,
          carPartName: "Front Windshield",
          productAllocationId: 1,
          installationImageUrl:
            "https://via.placeholder.com/300x200?text=Front+Windshield",
        },
        {
          id: 2,
          warrantyId: 1,
          carPartId: 2,
          carPartName: "Side Windows",
          productAllocationId: 2,
          installationImageUrl:
            "https://via.placeholder.com/300x200?text=Side+Windows",
        },
      ],
    },
    {
      warrantyId: 2,
      warrantyNo: "WRN-2024-001",
      clientName: "Ahmad bin Abdullah",
      clientContact: "+60123456789",
      clientEmail: "ahmad.abdullah@email.com",
      carBrand: "Toyota",
      carModel: "Vios",
      carPlateNo: "WXY1234",
      carChassisNo: "JTDBR32E300012345",
      shopName: "ProFilm KL Central",
      branchCode: "KL-001",
      installationDate: "2024-02-20T00:00:00Z",
      warrantyParts: [
        {
          id: 3,
          warrantyId: 2,
          carPartId: 3,
          carPartName: "Rear Windshield",
          productAllocationId: 3,
          installationImageUrl:
            "https://via.placeholder.com/300x200?text=Rear+Windshield",
        },
      ],
    },
    {
      warrantyId: 3,
      warrantyNo: "WRN-2024-002",
      clientName: "Siti Nurhaliza",
      clientContact: "+60198765432",
      clientEmail: "siti.nurhaliza@email.com",
      carBrand: "Honda",
      carModel: "Civic",
      carPlateNo: "ABC9999",
      carChassisNo: "JHMFC26508X012345",
      shopName: "ProFilm Penang",
      branchCode: "PN-002",
      installationDate: "2024-03-10T00:00:00Z",
      warrantyParts: [
        {
          id: 4,
          warrantyId: 3,
          carPartId: 1,
          carPartName: "Front Windshield",
          productAllocationId: 4,
          installationImageUrl:
            "https://via.placeholder.com/300x200?text=Front+Windshield",
        },
        {
          id: 5,
          warrantyId: 3,
          carPartId: 4,
          carPartName: "Sunroof",
          productAllocationId: 5,
          installationImageUrl:
            "https://via.placeholder.com/300x200?text=Sunroof",
        },
        {
          id: 6,
          warrantyId: 3,
          carPartId: 2,
          carPartName: "Side Windows",
          productAllocationId: 6,
          installationImageUrl:
            "https://via.placeholder.com/300x200?text=Side+Windows",
        },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Group warranties by warranty number
  const groupedWarranties = searchResults.reduce((acc: any, warranty: any) => {
    const warrantyNo = warranty.warrantyNo;
    if (!acc[warrantyNo]) {
      acc[warrantyNo] = [];
    }
    acc[warrantyNo].push(warranty);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-primary/10 to-primary/20 dark:from-zinc-900 dark:via-primary/20 dark:to-primary/30 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Warranty Search
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Search by car plate number or warranty number
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter car plate no. (e.g., ABC1234) or warranty no."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-zinc-300 dark:border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-zinc-700 dark:text-white transition-all"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Search Results ({searchResults.length}{" "}
              {searchResults.length === 1 ? "warranty" : "warranties"} found)
            </h2>

            {Object.entries(groupedWarranties).map(
              ([warrantyNo, warranties]: [string, any]) => (
                <div
                  key={warrantyNo}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Warranty Header */}
                  <div className="bg-linear-to-r from-primary to-primary/80 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">
                      Warranty No: {warrantyNo}
                    </h3>
                  </div>

                  {/* Warranty Details */}
                  <div className="p-6">
                    {warranties.map((warranty: any, index: number) => (
                      <div
                        key={index}
                        className={`${
                          index > 0
                            ? "border-t border-zinc-200 dark:border-zinc-700 mt-6 pt-6"
                            : ""
                        }`}
                      >
                        {/* Client Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">
                              Client Information
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                  Name:
                                </span>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {warranty.clientName}
                                </p>
                              </div>
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                  Contact:
                                </span>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {warranty.clientContact}
                                </p>
                              </div>
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                  Email:
                                </span>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {warranty.clientEmail}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Vehicle Information */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">
                              Vehicle Information
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                  Car Plate No:
                                </span>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {warranty.carPlateNo}
                                </p>
                              </div>
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                  Brand & Model:
                                </span>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {warranty.carBrand} {warranty.carModel}
                                </p>
                              </div>
                              <div>
                                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                  Chassis No:
                                </span>
                                <p className="font-medium text-zinc-900 dark:text-white">
                                  {warranty.carChassisNo}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Shop & Installation Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4">
                          <div className="space-y-2">
                            <div>
                              <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                Shop:
                              </span>
                              <p className="font-medium text-zinc-900 dark:text-white">
                                {warranty.shopName}
                              </p>
                            </div>
                            <div>
                              <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                                Branch Code:
                              </span>
                              <p className="font-medium text-zinc-900 dark:text-white">
                                {warranty.branchCode}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                              Installation Date:
                            </span>
                            <p className="font-medium text-zinc-900 dark:text-white">
                              {new Date(
                                warranty.installationDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Warranty Parts */}
                        {warranty.warrantyParts &&
                          warranty.warrantyParts.length > 0 && (
                            <div className="mt-6">
                              <h4 className="font-semibold text-lg text-zinc-900 dark:text-white mb-4">
                                Warranty Parts
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {warranty.warrantyParts.map(
                                  (part: any, partIndex: number) => (
                                    <div
                                      key={partIndex}
                                      className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                      <p className="font-medium text-zinc-900 dark:text-white mb-2">
                                        {part.carPartName}
                                      </p>
                                      {part.installationImageUrl && (
                                        <div className="mt-2 relative h-32 bg-zinc-100 dark:bg-zinc-700 rounded">
                                          <img
                                            src={part.installationImageUrl}
                                            alt={part.carPartName}
                                            className="w-full h-full object-cover rounded"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchResults.length === 0 && searchQuery && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-zinc-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              No warranties found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Try searching with a different car plate number or warranty number
            </p>
          </div>
        )}

        {/* Initial State */}
        {!searchQuery && searchResults.length === 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-20 w-20 text-primary mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
              Start your search
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Enter a car plate number or warranty number above to find warranty
              information
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
