"use client";

import { useState } from "react";
import Image from "next/image";
import { getWarrantiesByExactSearchApi } from "@/lib/apis/warrantiesApi";
import { WarrantySearchResult } from "@/types/warrantiesType";
import {
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  CalendarIcon,
  TruckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WarrantySearchResult[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedWarranty, setSelectedWarranty] =
    useState<WarrantySearchResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setSelectedWarranty(null);

    try {
      const results = await getWarrantiesByExactSearchApi(searchQuery.trim());
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setSelectedWarranty(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ProFilm E-Warranty
              </h1>
              <p className="text-sm text-gray-600">
                Warranty Verification Portal
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Search Your Warranty
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your warranty number or vehicle plate number to view your
            warranty details
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter warranty number or car plate number..."
                className="w-full px-6 py-4 sm:py-5 pr-32 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSearching ? (
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="h-5 w-5" />
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            <span>Example:</span>
            <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
              KLANG20241225001
            </code>
            <span>or</span>
            <code className="px-2 py-1 bg-gray-100 rounded text-gray-700">
              ABC 1234
            </code>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && !isSearching && (
          <div className="max-w-4xl mx-auto">
            {searchResults.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Warranty Found
                </h3>
                <p className="text-gray-600">
                  We couldn't find any warranty matching "{searchQuery}". Please
                  check your warranty number or vehicle plate number and try
                  again.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 text-sm text-gray-600">
                  Found {searchResults.length}{" "}
                  {searchResults.length === 1 ? "warranty" : "warranties"}
                </div>

                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div
                      key={result.warranty.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setSelectedWarranty(
                            selectedWarranty?.warranty.id === result.warranty.id
                              ? null
                              : result
                          )
                        }
                        className="w-full p-4 sm:p-6 text-left"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                {result.warranty.warrantyNo}
                              </h3>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <TruckIcon className="h-4 w-4 shrink-0" />
                                <span>{result.warranty.carPlateNo}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="h-4 w-4 shrink-0" />
                                <span>
                                  {formatDate(result.warranty.installationDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                result.warranty.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {result.warranty.isActive ? "Active" : "Inactive"}
                            </span>
                            <svg
                              className={`h-5 w-5 text-gray-400 transition-transform ${
                                selectedWarranty?.warranty.id ===
                                result.warranty.id
                                  ? "rotate-180"
                                  : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {selectedWarranty?.warranty.id === result.warranty.id && (
                        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                          {/* Warranty Information */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                              Warranty Information
                            </h4>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                              <div>
                                <dt className="text-gray-500">
                                  Warranty Number
                                </dt>
                                <dd className="font-medium text-gray-900 font-mono">
                                  {result.warranty.warrantyNo}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">
                                  Installation Date
                                </dt>
                                <dd className="font-medium text-gray-900">
                                  {formatDate(result.warranty.installationDate)}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">Shop</dt>
                                <dd className="font-medium text-gray-900">
                                  {result.warranty.shopName}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">Branch Code</dt>
                                <dd className="font-medium text-gray-900 font-mono">
                                  {result.warranty.branchCode}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-gray-500">
                                  Reference Number
                                </dt>
                                <dd className="font-medium text-gray-900 font-mono">
                                  {result.warranty.referenceNo || "-"}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-gray-200">
                            {/* Client Information */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Client Information
                              </h4>
                              <dl className="space-y-2 text-sm">
                                <div>
                                  <dt className="text-gray-500">Name</dt>
                                  <dd className="font-medium text-gray-900">
                                    {result.warranty.clientName}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-gray-500">Contact</dt>
                                  <dd className="font-medium text-gray-900">
                                    {result.warranty.clientContact}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-gray-500">Email</dt>
                                  <dd className="font-medium text-gray-900 break-all">
                                    {result.warranty.clientEmail}
                                  </dd>
                                </div>
                              </dl>
                            </div>

                            {/* Vehicle Information */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Vehicle Information
                              </h4>
                              <dl className="space-y-2 text-sm">
                                <div>
                                  <dt className="text-gray-500">Brand</dt>
                                  <dd className="font-medium text-gray-900">
                                    {result.warranty.carBrand}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-gray-500">Model</dt>
                                  <dd className="font-medium text-gray-900">
                                    {result.warranty.carModel}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-gray-500">Colour</dt>
                                  <dd className="font-medium text-gray-900">
                                    {result.warranty.carColour}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-gray-500">
                                    Plate Number
                                  </dt>
                                  <dd className="font-medium text-gray-900 font-mono">
                                    {result.warranty.carPlateNo}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-gray-500">
                                    Chassis Number
                                  </dt>
                                  <dd className="font-medium text-gray-900 font-mono">
                                    {result.warranty.carChassisNo}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>

                          {/* Installed Parts */}
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">
                              Installed Parts ({result.parts?.length || 0})
                            </h4>
                            {result.parts && result.parts.length > 0 ? (
                              <div className="space-y-4">
                                {result.parts.map((part, index) => (
                                  <div
                                    key={part.id}
                                    className="bg-white rounded-lg p-4 border border-gray-200"
                                  >
                                    <div className="flex flex-col sm:flex-row gap-4">
                                      {/* Part Image */}
                                      {part.installationImageUrl && (
                                        <div className="shrink-0">
                                          <img
                                            src={part.installationImageUrl}
                                            alt={part.carPartName}
                                            className="h-32 w-full sm:h-24 sm:w-24 rounded-lg object-contain border border-gray-200 bg-gray-50"
                                          />
                                        </div>
                                      )}

                                      {/* Part Details */}
                                      <div className="flex-1 min-w-0">
                                        <h5 className="font-semibold text-gray-900 mb-3">
                                          {part.carPartName}
                                        </h5>
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                          <div>
                                            <dt className="text-gray-500">
                                              Product Name
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                              {part.productName}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-gray-500">
                                              Brand
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                              {part.productBrand}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-gray-500">
                                              Type
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                              {part.productType}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-gray-500">
                                              Series
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                              {part.productSeries}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-gray-500">
                                              Film Serial Number
                                            </dt>
                                            <dd className="font-medium text-gray-900 font-mono">
                                              {part.filmSerialNumber}
                                            </dd>
                                          </div>
                                          <div>
                                            <dt className="text-gray-500">
                                              Warranty Period
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                              {part.warrantyInMonths} months
                                            </dd>
                                          </div>
                                        </dl>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-4">
                                No parts information available
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!hasSearched && (
          <div className="max-w-4xl mx-auto mt-12 sm:mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Easy Search
                </h3>
                <p className="text-sm text-gray-600">
                  Search using your warranty number or vehicle plate number
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Instant Verification
                </h3>
                <p className="text-sm text-gray-600">
                  View your warranty details and coverage instantly
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track Status
                </h3>
                <p className="text-sm text-gray-600">
                  Check warranty status and installation details
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 sm:mt-20 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} ProFilm E-Warranty. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
