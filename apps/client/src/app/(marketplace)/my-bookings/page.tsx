import { MyBookingsScreen } from "@/screens/booking/MyBookingsScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";

export default function MyBookingsPage() {
  return (
    <AuthenticatedGuard returnUrl="/my-bookings">
      <MyBookingsScreen />
    </AuthenticatedGuard>
  );
}
