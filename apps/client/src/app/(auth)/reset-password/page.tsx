import { Suspense } from "react";
import { ResetPasswordScreen } from "@/screens/auth/ResetPasswordScreen";
import { AuthPageSkeleton } from "@/components/auth/AuthPageSkeleton";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <ResetPasswordScreen />
    </Suspense>
  );
}
