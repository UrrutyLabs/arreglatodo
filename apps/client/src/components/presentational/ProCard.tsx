import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";
import type { Pro } from "@repo/domain";

interface ProCardProps {
  pro: Pro;
}

export function ProCard({ pro }: ProCardProps) {
  const isActive = pro.isApproved && !pro.isSuspended;

  return (
    <Link href={`/pros/${pro.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <Text variant="h2" className="text-text">
            {pro.name}
          </Text>
          {isActive && <Badge variant="success">Activo</Badge>}
        </div>
        {pro.serviceArea && (
          <Text variant="body" className="text-muted mb-2">
            {pro.serviceArea}
          </Text>
        )}
        {pro.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {pro.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="info">
                {category}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center">
          <Text variant="small" className="text-text font-medium">
            ${pro.hourlyRate.toFixed(0)}/hora
          </Text>
          {pro.rating && (
            <Text variant="small" className="text-muted">
              ⭐ {pro.rating.toFixed(1)} ({pro.reviewCount})
            </Text>
          )}
        </div>
      </Card>
    </Link>
  );
}
