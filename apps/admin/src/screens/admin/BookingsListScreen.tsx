"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { BookingStatus } from "@repo/domain";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { BookingsFilters } from "@/components/admin/BookingsFilters";
import { Text } from "@/components/ui/Text";

export function BookingsListScreen() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | undefined>();
  const [queryFilter, setQueryFilter] = useState("");

  const { data: bookings, isLoading } = trpc.booking.adminList.useQuery({
    status: statusFilter,
    query: queryFilter || undefined,
    limit: 100,
  });

  const handleClearFilters = () => {
    setStatusFilter(undefined);
    setQueryFilter("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Text variant="h1">Reservas</Text>
      </div>

      <BookingsFilters
        status={statusFilter}
        query={queryFilter}
        onStatusChange={setStatusFilter}
        onQueryChange={setQueryFilter}
        onClear={handleClearFilters}
      />

      <BookingsTable bookings={bookings || []} isLoading={isLoading} />
    </div>
  );
}
