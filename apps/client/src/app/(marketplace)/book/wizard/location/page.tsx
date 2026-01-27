"use client";

import { Suspense } from "react";
import { LocationStep } from "@/components/wizard/steps/LocationStep";
import { BookingCreateSkeleton } from "@/components/presentational/BookingCreateSkeleton";
import { AuthenticatedGuard } from "@/components/auth/AuthenticatedGuard";
import { Role } from "@repo/domain";

function LocationContent() {
  const handleNext = () => {
    // Navigation handled by component
  };

  const handleBack = () => {
    // Navigation handled by component
  };

  return <LocationStep onNext={handleNext} onBack={handleBack} />;
}

export const dynamic = "force-dynamic";

export default function LocationPage() {
  return (
    <AuthenticatedGuard requiredRole={Role.CLIENT}>
      <Suspense fallback={<BookingCreateSkeleton />}>
        <LocationContent />
      </Suspense>
    </AuthenticatedGuard>
  );
}
