import { getClaimByIdApi } from "@/lib/apis/claimsApi";
import ClaimForm from "../../_components/ClaimForm";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const claim = await getClaimByIdApi(Number(id));

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClaimForm claim={claim} mode="update" />
      </Suspense>
    </div>
  );
}
