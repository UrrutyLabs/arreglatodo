import { Suspense } from "react";
import { ConfirmEmailScreen } from "@/screens/auth/ConfirmEmailScreen";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailScreen />
    </Suspense>
  );
}
