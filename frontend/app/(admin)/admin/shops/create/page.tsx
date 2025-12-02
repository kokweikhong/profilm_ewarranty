import ShopForm from "../_components/ShopForm";
import { getMsiaStatesApi } from "@/lib/shopsApi";

export default async function Page() {
  const msiaStates = await getMsiaStatesApi();
  return <ShopForm msiaStates={msiaStates} />;
}
