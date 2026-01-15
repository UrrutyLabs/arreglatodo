import { BookingDetailScreen } from "@/screens/booking/BookingDetailScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";

export default function BookingDetailPage() {
  return (
    <AuthenticatedGuard>
      <BookingDetailScreen />
    </AuthenticatedGuard>
  );
}
