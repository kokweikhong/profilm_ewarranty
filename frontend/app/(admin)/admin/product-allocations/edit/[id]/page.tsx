import { getProductsApi } from "@/lib/apis/productsApi";
import { getShopsViewApi } from "@/lib/apis/shopsApi";
import { getProductAllocationByIdApi } from "@/lib/apis/productAllocationsApi";
import ProductAllocationForm from "../../_components/ProductAllocationForm";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productAllocation = await getProductAllocationByIdApi(Number(id));
  const products = await getProductsApi();
  const shops = await getShopsViewApi();
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductAllocationForm
          productAllocation={productAllocation}
          products={products}
          shops={shops}
          mode="update"
        />
      </Suspense>
    </div>
  );
}
