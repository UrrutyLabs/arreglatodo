import { BookingCreateScreen } from "@/screens/booking/BookingCreateScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";

export const dynamic = "force-dynamic";

export default function BookPage() {
  return (
    <AuthenticatedGuard>
      <BookingCreateScreen />
    </AuthenticatedGuard>
  );
}
