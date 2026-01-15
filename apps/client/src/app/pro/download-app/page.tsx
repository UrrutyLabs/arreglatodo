import { Suspense } from "react";
import { ProDownloadAppScreen } from "@/screens/pro/ProDownloadAppScreen";
import { AuthPageSkeleton } from "@/components/auth/AuthPageSkeleton";
import { ProDownloadAppGuard } from "@/components/pro/ProDownloadAppGuard";

export default function ProDownloadAppPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <ProDownloadAppGuard>
        <ProDownloadAppScreen />
      </ProDownloadAppGuard>
    </Suspense>
  );
}
