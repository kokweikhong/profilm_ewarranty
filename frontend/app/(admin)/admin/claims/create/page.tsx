import ClaimForm from "../_components/ClaimForm";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ClaimForm mode="create" />
      </Suspense>
    </div>
  );
}
