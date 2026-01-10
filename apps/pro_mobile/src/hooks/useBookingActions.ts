import { useState } from "react";
import { trpc } from "../lib/trpc/client";

interface UseBookingActionsProps {
  onSuccess?: () => void;
}

export function useBookingActions({ onSuccess }: UseBookingActionsProps = {}) {
  const [error, setError] = useState<string | null>(null);

  const acceptBooking = (trpc as any).booking.accept.useMutation({
    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },
    onError: (_err: unknown) => {
      setError("Error al aceptar la reserva");
    },
  });

  const rejectBooking = (trpc as any).booking.reject.useMutation({
    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },
    onError: (_err: unknown) => {
      setError("Error al rechazar la reserva");
    },
  });

  const completeBooking = (trpc as any).booking.complete.useMutation({
    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },
    onError: (_err: unknown) => {
      setError("Error al completar la reserva");
    },
  });

  return {
    acceptBooking: (bookingId: string) => acceptBooking.mutate({ bookingId }),
    rejectBooking: (bookingId: string) => rejectBooking.mutate({ bookingId }),
    completeBooking: (bookingId: string) => completeBooking.mutate({ bookingId }),
    isAccepting: acceptBooking.isPending,
    isRejecting: rejectBooking.isPending,
    isCompleting: completeBooking.isPending,
    error,
  };
}
