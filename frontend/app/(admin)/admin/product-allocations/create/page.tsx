"use client";

import { useEffect, useState } from "react";
import { getProductsApi } from "@/lib/apis/productsApi";
import { getShopsViewApi } from "@/lib/apis/shopsApi";
import ProductAllocationForm from "../_components/ProductAllocationForm";
import { Product } from "@/types/productsType";
import { ShopListResponse } from "@/types/shopsType";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<ShopListResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, shopsData] = await Promise.all([
          getProductsApi(),
          getShopsViewApi(),
        ]);
        setProducts(productsData);
        setShops(shopsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProductAllocationForm products={products} shops={shops} mode="create" />
    </div>
  );
}
