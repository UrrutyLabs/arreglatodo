"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Navigation } from "@/components/presentational/Navigation";
import { ReviewForm } from "@/components/forms/ReviewForm";

export function ReviewCreateScreen() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch booking to verify it exists
  const { data: booking, isLoading: isLoadingBooking } = trpc.booking.getById.useQuery(
    { id: bookingId },
    {
      retry: false,
    }
  );

  const createReview = trpc.review.create.useMutation({
    onSuccess: () => {
      router.push(`/my-bookings/${bookingId}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createReview.mutateAsync({
        bookingId,
        rating,
        comment: comment || undefined,
      });
      // Success - mutation's onSuccess will handle redirect
    } catch (err) {
      // Error is handled by mutation state
    }
  };

  if (isLoadingBooking) {
    return (
      <div className="min-h-screen bg-bg">
        <Navigation showLogin={false} showProfile={true} />
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <Text variant="body" className="text-muted">
                Cargando...
              </Text>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-bg">
        <Navigation showLogin={false} showProfile={true} />
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <Text variant="h2" className="mb-2 text-text">
                Reserva no encontrada
              </Text>
              <Text variant="body" className="text-muted mb-4">
                La reserva que buscas no existe.
              </Text>
              <button
                onClick={() => router.push("/my-bookings")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
              >
                Volver a mis reservas
              </button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navigation showLogin={false} showProfile={true} />
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Text variant="h1" className="mb-6 text-primary">
            Dejar reseña
          </Text>

          <Card className="p-6">
            <ReviewForm
              rating={rating}
              comment={comment}
              onRatingChange={setRating}
              onCommentChange={setComment}
              onSubmit={handleSubmit}
              loading={createReview.isPending}
              error={createReview.error?.message}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
