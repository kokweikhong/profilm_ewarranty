import {
  getProductByIdApi,
  getProductBrandsApi,
  getProductTypesApi,
  getProductSeriesApi,
  getProductNamesApi,
  // getWarrantyPeriodsApi,
} from "@/lib/apis/productsApi";
import { getWarrantyByIdApi } from "@/lib/apis/warrantiesApi";
import ProductForm from "../../_components/WarrantyForm";
import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import { getCarPartsApi } from "@/lib/apis/warrantiesApi";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const warranty = await getWarrantyByIdApi(Number(id));
  const carParts = await getCarPartsApi();
  console.log("warranty:", warranty);
  if (warranty) {
    warranty.installationDate = formatDate(warranty.installationDate);
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductForm warranty={warranty} carParts={carParts} mode="update" />
      </Suspense>
    </div>
  );
}
