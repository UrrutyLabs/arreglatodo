import { ProLandingScreen } from "@/screens/pro/ProLandingScreen";
import { ProLandingGuard } from "@/components/pro/ProLandingGuard";

export default function ProLandingPage() {
  return (
    <ProLandingGuard>
      <ProLandingScreen />
    </ProLandingGuard>
  );
}
