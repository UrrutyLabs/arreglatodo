"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";

interface ProRow {
  id: string;
  displayName: string;
  email: string;
  status: "pending" | "active" | "suspended";
  completedJobsCount: number;
  isPayoutProfileComplete: boolean;
  createdAt: Date;
}

interface ProsTableProps {
  pros: ProRow[];
  isLoading?: boolean;
}

export function ProsTable({ pros, isLoading }: ProsTableProps) {
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-UY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeVariant = (
    status: "pending" | "active" | "suspended"
  ): "info" | "success" | "warning" | "danger" => {
    const statusMap: Record<
      "pending" | "active" | "suspended",
      "info" | "success" | "warning" | "danger"
    > = {
      pending: "warning",
      active: "success",
      suspended: "danger",
    };
    return statusMap[status] || "info";
  };

  const getStatusLabel = (status: "pending" | "active" | "suspended") => {
    const labels: Record<"pending" | "active" | "suspended", string> = {
      pending: "Pendiente",
      active: "Activo",
      suspended: "Suspendido",
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="body" className="text-gray-600">
          Cargando profesionales...
        </Text>
      </div>
    );
  }

  if (pros.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="body" className="text-gray-600">
          No se encontraron profesionales.
        </Text>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trabajos Completados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perfil de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pros.map((pro) => (
              <tr
                key={pro.id}
                onClick={() => router.push(`/admin/pros/${pro.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="font-medium text-gray-900">
                    {pro.displayName}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="text-gray-600">
                    {pro.email}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusBadgeVariant(pro.status)}>
                    {getStatusLabel(pro.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" className="text-gray-900">
                    {pro.completedJobsCount}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {pro.isPayoutProfileComplete ? (
                    <Badge variant="success">Completo</Badge>
                  ) : (
                    <Badge variant="warning">Incompleto</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="small" className="text-gray-500">
                    {formatDate(pro.createdAt)}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
