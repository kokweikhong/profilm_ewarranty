import {
  getProductBrandsApi,
  getProductTypesApi,
  getProductSeriesApi,
  getProductNamesApi,
} from "@/lib/apis/productsApi";
import ProductForm from "../_components/ProductForm";
import { Suspense } from "react";

export default async function Page() {
  const brands = await getProductBrandsApi();
  const types = await getProductTypesApi();
  const series = await getProductSeriesApi();
  const names = await getProductNamesApi();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductForm
          brands={brands}
          types={types}
          series={series}
          names={names}
          mode="create"
        />
      </Suspense>
    </div>
  );
}
