"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Text } from "@repo/ui";
import { Card } from "@repo/ui";
import { Button } from "@repo/ui";
import { Navigation } from "@/components/presentational/Navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { ProProfileSkeleton } from "@/components/presentational/ProProfileSkeleton";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { useProDetail } from "@/hooks/pro";
import { useAuth } from "@/hooks/auth";
import { useCategories } from "@/hooks/category";
import {
  ProProfileHeader,
  ProBio,
  ProOverview,
  ProAvailability,
  ProServicesOffered,
  ProReviews,
  ProRequestForm,
} from "@/components/pro";

export function ProProfileScreen() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const proId = params.proId as string;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const searchQuery = searchParams.get("q") || "";

  const { pro, isLoading, error } = useProDetail(proId);
  const { user, loading: authLoading } = useAuth();
  const { categories } = useCategories();

  // Map categoryIds to Category objects for display
  const proCategories = useMemo(
    () =>
      pro?.categoryIds
        ? categories.filter((cat) => pro.categoryIds.includes(cat.id))
        : [],
    [pro, categories]
  );

  // Calculate derived states
  const isActive = useMemo(
    () => pro?.isApproved && !pro?.isSuspended,
    [pro?.isApproved, pro?.isSuspended]
  );

  const handleReserveClick = () => {
    if (authLoading) {
      // Still checking auth, wait
      return;
    }
    if (!user) {
      // Not authenticated, show modal
      setShowAuthModal(true);
      return;
    }
    // Ensure pro exists before proceeding
    if (!pro?.id) {
      return;
    }
    // Authenticated, proceed to job creation
    router.push(`/book?proId=${pro.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navigation
          showLogin={false}
          showProfile={true}
          centerContent={
            <SearchBar initialQuery={searchQuery} preserveParams={true} />
          }
        />
        <div className="px-4 py-4 md:py-8">
          <ProProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error || !pro) {
    return (
      <div className="min-h-screen bg-bg">
        <Navigation
          showLogin={false}
          showProfile={true}
          centerContent={
            <SearchBar initialQuery={searchQuery} preserveParams={true} />
          }
        />
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
              <Text variant="h2" className="mb-2 text-text">
                Profesional no encontrado
              </Text>
              <Text variant="body" className="text-muted mb-4">
                El profesional que buscas no existe o fue eliminado.
              </Text>
              <Link href="/search">
                <Button
                  variant="primary"
                  className="flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver a búsqueda
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navigation
        showLogin={true}
        showProfile={true}
        centerContent={
          <SearchBar initialQuery={searchQuery} preserveParams={true} />
        }
      />
      <div className="px-4 py-4 md:py-8 pb-24 lg:pb-4 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Scrollable Profile (2 columns on lg+) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pro Profile Header */}
              <ProProfileHeader
                name={pro.name}
                avatarUrl={pro.avatarUrl}
                rating={pro.rating}
                reviewCount={pro.reviewCount}
              />

              {/* Bio Section */}
              <ProBio bio={pro.bio} />

              {/* Overview Section */}
              <ProOverview
                completedJobsCount={pro.completedJobsCount}
                serviceArea={pro.serviceArea}
              />

              {/* Availability Section */}
              {pro.availabilitySlots && pro.availabilitySlots.length > 0 && (
                <ProAvailability availabilitySlots={pro.availabilitySlots} />
              )}

              {/* Services Offered Section */}
              {proCategories.length > 0 && (
                <ProServicesOffered categories={proCategories} />
              )}

              {/* Reviews Section */}
              <ProReviews
                proId={pro.id}
                rating={pro.rating}
                reviewCount={pro.reviewCount}
              />
            </div>

            {/* Right: Fixed Request Form (1 column on lg+) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="lg:sticky lg:top-4">
                {isActive && !pro.isSuspended && (
                  <ProRequestForm
                    hourlyRate={pro.hourlyRate}
                    proId={pro.id}
                    onContratar={handleReserveClick}
                    disabled={authLoading}
                    isMobileFooter={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Sticky Footer */}
      {isActive && !pro.isSuspended && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-surface shadow-lg">
          <div className="px-4 py-3">
            <ProRequestForm
              hourlyRate={pro.hourlyRate}
              proId={pro.id}
              onContratar={handleReserveClick}
              disabled={authLoading}
              isMobileFooter={true}
            />
          </div>
        </div>
      )}

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        returnUrl={`/book?proId=${pro.id}`}
        title="Iniciá sesión para contratar"
        message="Necesitás iniciar sesión para contratar un servicio con este profesional."
      />
    </div>
  );
}
