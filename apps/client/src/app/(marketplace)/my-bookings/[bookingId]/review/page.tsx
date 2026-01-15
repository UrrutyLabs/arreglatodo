import { ReviewCreateScreen } from "@/screens/booking/ReviewCreateScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";

export default function ReviewCreatePage() {
  return (
    <AuthenticatedGuard>
      <ReviewCreateScreen />
    </AuthenticatedGuard>
  );
}
