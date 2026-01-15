import { CheckoutScreen } from "@/screens/booking/CheckoutScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";

export default function CheckoutPage() {
  return (
    <AuthenticatedGuard>
      <CheckoutScreen />
    </AuthenticatedGuard>
  );
}
