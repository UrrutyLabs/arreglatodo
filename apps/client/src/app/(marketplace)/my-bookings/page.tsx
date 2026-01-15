import { MyBookingsScreen } from "@/screens/booking/MyBookingsScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";
import { Role } from "@repo/domain";

export default function MyBookingsPage() {
  return (
    <AuthenticatedGuard returnUrl="/my-bookings" requiredRole={Role.CLIENT}>
      <MyBookingsScreen />
    </AuthenticatedGuard>
  );
}
