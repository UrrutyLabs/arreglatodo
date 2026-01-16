import { ProFAQScreen } from "@/screens/pro/ProFAQScreen";
import { ProLandingGuard } from "@/components/pro/ProLandingGuard";

export default function ProFAQPage() {
  return (
    <ProLandingGuard>
      <ProFAQScreen />
    </ProLandingGuard>
  );
}
