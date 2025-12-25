import { getCarPartsApi } from "@/lib/apis/warrantiesApi";
import WarrantyForm from "../_components/WarrantyForm";
import { Suspense } from "react";
import { getProductsFromAllocationByShopIdApi } from "@/lib/apis/productAllocationsApi";

export default async function Page() {
  const carParts = await getCarPartsApi();
  const productsFromAllocation = await getProductsFromAllocationByShopIdApi(1); // Example shopId
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <WarrantyForm
          carParts={carParts}
          productsFromAllocation={productsFromAllocation}
          mode="create"
        />
      </Suspense>
    </div>
  );
}
