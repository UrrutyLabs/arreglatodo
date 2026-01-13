"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { ProsTable } from "@/components/admin/ProsTable";
import { ProsFilters } from "@/components/admin/ProsFilters";
import { Text } from "@/components/ui/Text";

export function ProsListScreen() {
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "active" | "suspended" | undefined
  >();
  const [queryFilter, setQueryFilter] = useState("");

  const { data: pros, isLoading } = trpc.pro.adminList.useQuery({
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
        <Text variant="h1">Profesionales</Text>
      </div>

      <ProsFilters
        status={statusFilter}
        query={queryFilter}
        onStatusChange={setStatusFilter}
        onQueryChange={setQueryFilter}
        onClear={handleClearFilters}
      />

      <ProsTable pros={pros || []} isLoading={isLoading} />
    </div>
  );
}
