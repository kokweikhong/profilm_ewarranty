import axios from "axios";
import { getApiBaseUrl } from "@/lib/env";
import { Claim } from "@/types/claimsType";

export async function getClaimsApi(): Promise<Claim[]> {
  const response = await axios.get<Claim[]>(`${getApiBaseUrl()}/claims`);
  return response.data;
}

export async function getClaimByIdApi(id: number): Promise<Claim> {
  const response = await axios.get<Claim>(`${getApiBaseUrl()}/claims/${id}`);
  return response.data;
}
