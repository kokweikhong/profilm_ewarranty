"use client";

import { useEffect, useState } from "react";
import {
  getProductBrandsApi,
  getProductTypesApi,
  getProductSeriesApi,
  getProductNamesApi,
} from "@/lib/apis/productsApi";
import ProductForm from "../_components/ProductForm";
import {
  ProductBrand,
  ProductType,
  ProductSeries,
  ProductName,
} from "@/types/productsType";

export default function Page() {
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [series, setSeries] = useState<ProductSeries[]>([]);
  const [names, setNames] = useState<ProductName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, typesData, seriesData, namesData] =
          await Promise.all([
            getProductBrandsApi(),
            getProductTypesApi(),
            getProductSeriesApi(),
            getProductNamesApi(),
          ]);
        setBrands(brandsData);
        setTypes(typesData);
        setSeries(seriesData);
        setNames(namesData);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-primary"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">
              Loading Product Form
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please wait while we prepare everything...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-x-3">
          <a
            href="/admin/products"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to Products
          </a>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Create New Product
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Add a new product to your catalog with complete details and
          specifications.
        </p>
      </div>
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-6">
        <ProductForm
          brands={brands}
          types={types}
          series={series}
          names={names}
          mode="create"
        />
      </div>
    </div>
  );
}
