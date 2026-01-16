"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getWarrantyByIdApi,
  getCarPartsApi,
  getWarrantiesWithPartsByIdApi,
} from "@/lib/apis/warrantiesApi";
import WarrantyForm from "../../_components/WarrantyForm";
import { formatDate } from "@/lib/utils";
import { CarPart, WarrantyWithPartsResponse } from "@/types/warrantiesType";
import { ProductsFromAllocationByShopIdResponse } from "@/types/productAllocationsType";
import { getProductsFromAllocationByShopIdApi } from "@/lib/apis/productAllocationsApi";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [warranty, setWarranty] = useState<WarrantyWithPartsResponse | null>(
    null
  );
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [productsFromAllocation, setProductsFromAllocation] = useState<
    ProductsFromAllocationByShopIdResponse[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warrantyData = await getWarrantiesWithPartsByIdApi(Number(id));

        if (warrantyData) {
          warrantyData.warranty.installationDate = formatDate(
            warrantyData.warranty.installationDate
          );

          // Fetch car parts and products from allocation for the warranty's shop
          const [carPartsData, productsData] = await Promise.all([
            getCarPartsApi(),
            getProductsFromAllocationByShopIdApi(warrantyData.warranty.shopId),
          ]);

          setWarranty(warrantyData);
          setCarParts(carPartsData);
          setProductsFromAllocation(productsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Warranty Data:", warranty);

  return (
    <div>
      <WarrantyForm
        data={warranty}
        carParts={carParts}
        productsFromAllocation={productsFromAllocation}
        mode="update"
      />
    </div>
  );
}
