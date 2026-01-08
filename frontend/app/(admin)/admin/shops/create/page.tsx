import ShopForm from "../_components/ShopForm";
import { getMsiaStatesApi } from "@/lib/apis/shopsApi";
import { ShopDummyData } from "@/types/shopsType";

export const dynamic = "force-dynamic";

export default async function Page() {
  const msiaStates = await getMsiaStatesApi();
  // sort states by name
  msiaStates.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <ShopForm msiaStates={msiaStates} shop={ShopDummyData} mode="create" />
  );
}
