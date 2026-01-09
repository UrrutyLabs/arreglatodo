import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No se encontraron resultados",
  description = "Intenta ajustar los filtros de búsqueda.",
}: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      <Text variant="h2" className="mb-2 text-text">
        {title}
      </Text>
      <Text variant="body" className="text-muted">
        {description}
      </Text>
    </Card>
  );
}
