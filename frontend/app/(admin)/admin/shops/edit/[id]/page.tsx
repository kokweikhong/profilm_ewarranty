import { Suspense } from "react";
import ShopForm from "../../_components/ShopForm";
import { getMsiaStatesApi, getShopByIdApi } from "@/lib/apis/shopsApi";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await getShopByIdApi(Number(id));
  const msiaStates = await getMsiaStatesApi();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ShopForm msiaStates={msiaStates} shop={shop} mode="update" />
      </Suspense>
    </div>
  );
}
