"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/components/ui/Text";
import { formatCurrency } from "@repo/domain";
import { PayoutStatusBadge } from "@/components/utils/PayoutStatusBadge";
import { formatDateShort } from "@/components/utils/formatDate";

interface PayoutRow {
  id: string;
  proProfileId: string;
  provider: string;
  status: string;
  currency: string;
  amount: number;
  providerReference: string | null;
  createdAt: Date;
  sentAt: Date | null;
}

interface PayoutsTableProps {
  payouts: PayoutRow[];
  isLoading?: boolean;
}

export function PayoutsTable({ payouts, isLoading }: PayoutsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <Text variant="body" className="text-gray-600">
          Cargando cobros...
        </Text>
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <Text variant="body" className="text-gray-600">
          No se encontraron cobros
        </Text>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profesional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payouts.map((payout) => (
              <tr
                key={payout.id}
                onClick={() => router.push(`/admin/payouts/${payout.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <PayoutStatusBadge status={payout.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payout.proProfileId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payout.amount, payout.currency, true)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payout.provider}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payout.providerReference || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateShort(payout.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
