"use client";

import { Suspense } from "react";
import { ServiceDetailsStep } from "@/components/wizard/steps/ServiceDetailsStep";
import { BookingCreateSkeleton } from "@/components/presentational/BookingCreateSkeleton";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";
import { Role } from "@repo/domain";

function ServiceDetailsContent() {
  const handleNext = () => {
    // Navigation handled by component
  };

  return <ServiceDetailsStep onNext={handleNext} />;
}

export const dynamic = "force-dynamic";

export default function ServiceDetailsPage() {
  return (
    <AuthenticatedGuard requiredRole={Role.CLIENT}>
      <Suspense fallback={<BookingCreateSkeleton />}>
        <ServiceDetailsContent />
      </Suspense>
    </AuthenticatedGuard>
  );
}
