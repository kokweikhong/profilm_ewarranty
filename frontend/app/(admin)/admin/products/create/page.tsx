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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProductForm
        brands={brands}
        types={types}
        series={series}
        names={names}
        mode="create"
      />
    </div>
  );
}
