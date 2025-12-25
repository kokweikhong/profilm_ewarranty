import { getProductsApi } from "@/lib/apis/productsApi";
import { getShopsViewApi } from "@/lib/apis/shopsApi";
import ProductAllocationForm from "../_components/ProductAllocationForm";
import { Suspense } from "react";

export default async function Page() {
  const products = await getProductsApi();
  const shops = await getShopsViewApi();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductAllocationForm
          products={products}
          shops={shops}
          mode="create"
        />
      </Suspense>
    </div>
  );
}
