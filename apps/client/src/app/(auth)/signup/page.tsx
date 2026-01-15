import { Suspense } from "react";
import { SignupScreen } from "@/screens/auth/SignupScreen";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupScreen />
    </Suspense>
  );
}
