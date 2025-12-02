import axios from "axios";
import { MsiaState } from "@/types/shopsType";
import { getApiBaseUrl } from "@/lib/env";

export async function getMsiaStatesApi(): Promise<MsiaState[]> {
  const response = await axios.get<MsiaState[]>(
    `${getApiBaseUrl()}/shops/states`
  );
  return response.data;
}
