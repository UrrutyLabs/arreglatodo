import { Suspense } from "react";
import { RequestPasswordResetScreen } from "@/screens/auth/RequestPasswordResetScreen";
import { AuthPageSkeleton } from "@/components/auth/AuthPageSkeleton";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <RequestPasswordResetScreen />
    </Suspense>
  );
}
