import { SettingsScreen } from "@/screens/settings/SettingsScreen";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";

export default function SettingsPage() {
  return (
    <AuthenticatedGuard returnUrl="/settings" maxWidth="max-w-7xl">
      <SettingsScreen />
    </AuthenticatedGuard>
  );
}
