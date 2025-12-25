import {
  getProductByIdApi,
  getProductBrandsApi,
  getProductTypesApi,
  getProductSeriesApi,
  getProductNamesApi,
} from "@/lib/apis/productsApi";
import ProductForm from "../../_components/ProductForm";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductByIdApi(Number(id));
  const brands = await getProductBrandsApi();
  const types = await getProductTypesApi();
  const series = await getProductSeriesApi();
  const names = await getProductNamesApi();

  console.log("brands:", brands);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductForm
          product={product}
          brands={brands}
          types={types}
          series={series}
          names={names}
          mode="update"
        />
      </Suspense>
    </div>
  );
}
