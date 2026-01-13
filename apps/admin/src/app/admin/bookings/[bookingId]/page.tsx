"use client";

import { use } from "react";
import { BookingDetailScreen } from "@/screens/admin/BookingDetailScreen";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default function AdminBookingDetailPage({ params }: PageProps) {
  const { bookingId } = use(params);
  return <BookingDetailScreen bookingId={bookingId} />;
}
