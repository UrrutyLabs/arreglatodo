"use client";

import { useState } from "react";
import { OrderStatus } from "@repo/domain";
import { useOrders } from "@/hooks/useOrders";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { Text } from "@repo/ui";
import { ORDER_LABELS } from "@/utils/orderLabels";

export function OrdersListScreen() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [queryFilter, setQueryFilter] = useState("");

  const { data: orders, isLoading } = useOrders({
    status: statusFilter,
    query: queryFilter,
    limit: 100,
  });

  const handleClearFilters = () => {
    setStatusFilter(undefined);
    setQueryFilter("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Text variant="h1">{ORDER_LABELS.ordersList}</Text>
      </div>

      <OrdersFilters
        status={statusFilter}
        query={queryFilter}
        onStatusChange={setStatusFilter}
        onQueryChange={setQueryFilter}
        onClear={handleClearFilters}
      />

      <OrdersTable orders={orders || []} isLoading={isLoading} />
    </div>
  );
}
