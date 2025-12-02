import {
  getProductByIdApi,
  getProductBrandsApi,
  getProductTypesApi,
  getProductSeriesApi,
  getProductNamesApi,
  getWarrantyPeriodsApi,
} from "@/lib/productsApi";
import ProductForm from "../_components/ProductForm";
import { Suspense } from "react";

export default async function Page() {
  const brands = await getProductBrandsApi();
  const types = await getProductTypesApi();
  const series = await getProductSeriesApi();
  const names = await getProductNamesApi();
  const warranties = await getWarrantyPeriodsApi();

  console.log("brands:", brands);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductForm
          brands={brands}
          types={types}
          series={series}
          names={names}
          warranties={warranties}
          mode="create"
        />
      </Suspense>
    </div>
  );
}
