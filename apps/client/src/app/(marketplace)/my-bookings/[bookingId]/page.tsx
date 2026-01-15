import { BookingDetailScreen } from "@/screens/booking/BookingDetailScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";
import { Role } from "@repo/domain";

export default function BookingDetailPage() {
  return (
    <AuthenticatedGuard requiredRole={Role.CLIENT}>
      <BookingDetailScreen />
    </AuthenticatedGuard>
  );
}
