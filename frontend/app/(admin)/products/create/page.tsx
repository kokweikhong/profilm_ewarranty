"use client";

import { useState, useEffect } from "react";
import { ProductBrandService } from "@/services/productBrandService";
import { ProductTypeService } from "@/services/productTypeService";
import { ProductSeriesService } from "@/services/productSeriesService";
import { ProductNameService } from "@/services/productNameService";
import { ProductBrand } from "@/types/productBrand";
import { ProductType } from "@/types/productType";
import { ProductSeries } from "@/types/productSeries";
import { ProductName } from "@/types/productName";

export default function CreateProductPage() {
  // State for dropdown options
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [series, setSeries] = useState<ProductSeries[]>([]);
  const [names, setNames] = useState<ProductName[]>([]);

  // State for selected values
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const [selectedNameId, setSelectedNameId] = useState<string>("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [typesLoading, setTypesLoading] = useState(false);
  const [seriesLoading, setSeriesLoading] = useState(false);
  const [namesLoading, setNamesLoading] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Global error handler
  const handleError = (error: any, context: string) => {
    console.error(`Error in ${context}:`, error);
    setError(`Error loading ${context}: ${error.message || "Unknown error"}`);
  };

  // Handle global errors and browser extension conflicts
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Promise Rejection:", event.reason);
      // Only set error if it seems related to our API calls
      if (
        event.reason &&
        event.reason.message &&
        (event.reason.message.includes("fetch") ||
          event.reason.message.includes("network") ||
          event.reason.message.includes("axios"))
      ) {
        setError(
          "Network error occurred. Please check your connection and try again."
        );
      }
    };

    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error);
      // Don't show extension-related errors to user
      if (
        event.error &&
        event.error.message &&
        !event.error.message.includes("Extension") &&
        !event.error.message.includes("chrome-extension")
      ) {
        setError("An unexpected error occurred. Please refresh and try again.");
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  // Load brands on component mount
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const loadBrands = async () => {
      try {
        setLoading(true);
        const brandsData = await ProductBrandService.getAll();

        // Only update state if component is still mounted
        if (isMounted) {
          setBrands(brandsData);
        }
      } catch (error) {
        if (isMounted) {
          handleError(error, "brands");
          setBrands([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBrands();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []);

  // Load types when brand is selected
  useEffect(() => {
    let isMounted = true;

    const loadTypes = async () => {
      if (!selectedBrandId) {
        if (isMounted) {
          setTypes([]);
          setSelectedTypeId("");
          setSeries([]);
          setSelectedSeriesId("");
          setNames([]);
          setSelectedNameId("");
        }
        return;
      }

      try {
        if (isMounted) {
          setTypesLoading(true);
          setSelectedTypeId(""); // Reset type selection
          setSeries([]); // Clear series
          setSelectedSeriesId(""); // Reset series selection
          setNames([]); // Clear names
          setSelectedNameId(""); // Reset name selection
        }

        const typesData = await ProductTypeService.getByBrandId(
          selectedBrandId
        );

        if (isMounted) {
          setTypes(typesData);
        }
      } catch (error) {
        console.error("Error loading types:", error);
        if (isMounted) {
          setTypes([]);
        }
      } finally {
        if (isMounted) {
          setTypesLoading(false);
        }
      }
    };

    loadTypes();

    return () => {
      isMounted = false;
    };
  }, [selectedBrandId]);

  // Load series when type is selected
  useEffect(() => {
    let isMounted = true;

    const loadSeries = async () => {
      if (!selectedTypeId) {
        if (isMounted) {
          setSeries([]);
          setSelectedSeriesId("");
        }
        return;
      }

      try {
        if (isMounted) {
          setSeriesLoading(true);
          setSelectedSeriesId(""); // Reset series selection
        }

        const seriesData = await ProductSeriesService.getByProductTypeId(
          selectedTypeId
        );

        if (isMounted) {
          setSeries(seriesData);
        }
      } catch (error) {
        console.error("Error loading series:", error);
        if (isMounted) {
          setSeries([]);
        }
      } finally {
        if (isMounted) {
          setSeriesLoading(false);
        }
      }
    };

    loadSeries();

    return () => {
      isMounted = false;
    };
  }, [selectedTypeId]);

  // Load names when series is selected
  useEffect(() => {
    let isMounted = true;

    const loadNames = async () => {
      if (!selectedSeriesId) {
        if (isMounted) {
          setNames([]);
          setSelectedNameId("");
        }
        return;
      }

      try {
        if (isMounted) {
          setNamesLoading(true);
          setSelectedNameId(""); // Reset name selection
        }

        const namesData = await ProductNameService.getBySeriesId(
          selectedSeriesId
        );

        if (isMounted) {
          setNames(namesData);
        }
      } catch (error) {
        console.error("Error loading names:", error);
        if (isMounted) {
          setNames([]);
        }
      } finally {
        if (isMounted) {
          setNamesLoading(false);
        }
      }
    };

    loadNames();

    return () => {
      isMounted = false;
    };
  }, [selectedSeriesId]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create Product</h1>
        <p>Loading brands...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      <form>
        {/* Product Brand Dropdown */}
        <div className="mt-6">
          <label className="block mb-2 font-medium" htmlFor="brand">
            Product Brand *
          </label>
          <select
            id="brand"
            name="brand"
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            required
          >
            <option value="">Select a brand...</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type Dropdown */}
        <div className="mt-6">
          <label className="block mb-2 font-medium" htmlFor="type">
            Product Type *
          </label>
          <select
            id="type"
            name="type"
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
            disabled={!selectedBrandId || typesLoading}
            className="border border-gray-300 rounded px-3 py-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          >
            <option value="">
              {!selectedBrandId
                ? "Please select a brand first..."
                : typesLoading
                ? "Loading types..."
                : "Select a type..."}
            </option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Series Dropdown */}
        <div className="mt-6">
          <label className="block mb-2 font-medium" htmlFor="series">
            Product Series *
          </label>
          <select
            id="series"
            name="series"
            value={selectedSeriesId}
            onChange={(e) => setSelectedSeriesId(e.target.value)}
            disabled={!selectedTypeId || seriesLoading}
            className="border border-gray-300 rounded px-3 py-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          >
            <option value="">
              {!selectedTypeId
                ? "Please select a type first..."
                : seriesLoading
                ? "Loading series..."
                : "Select a series..."}
            </option>
            {series.map((seriesItem) => (
              <option key={seriesItem.id} value={seriesItem.id}>
                {seriesItem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name Dropdown */}
        <div className="mt-6">
          <label className="block mb-2 font-medium" htmlFor="name">
            Product Name *
          </label>
          <select
            id="name"
            name="name"
            value={selectedNameId}
            onChange={(e) => setSelectedNameId(e.target.value)}
            disabled={!selectedSeriesId || namesLoading}
            className="border border-gray-300 rounded px-3 py-2 w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          >
            <option value="">
              {!selectedSeriesId
                ? "Please select a series first..."
                : namesLoading
                ? "Loading names..."
                : "Select a name..."}
            </option>
            {names.map((nameItem) => (
              <option key={nameItem.id} value={nameItem.id}>
                {nameItem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
          <p>
            <strong>Selected:</strong>
          </p>
          <p>Brand ID: {selectedBrandId || "None"}</p>
          <p>Type ID: {selectedTypeId || "None"}</p>
          <p>Series ID: {selectedSeriesId || "None"}</p>
          <p>Available Types: {types.length}</p>
          <p>Available Series: {series.length}</p>
        </div>
      </form>
    </div>
  );
}
