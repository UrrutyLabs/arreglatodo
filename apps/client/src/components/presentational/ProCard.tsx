import { memo, useMemo } from "react";
import Link from "next/link";
import { Clock, Calendar, Award, CheckCircle2, MapPin } from "lucide-react";
import { Card, Text, Badge, Button, Avatar } from "@repo/ui";
import { type Pro } from "@repo/domain";
import { useTodayDate } from "@/hooks/shared/useTodayDate";
import { getAvailabilityHint } from "@/utils/proAvailability";
import { formatResponseTime, formatCompletedJobs } from "@/utils/proFormatting";
import { RatingStars } from "./RatingStars";

interface ProCardProps {
  pro: Pro;
}

export const ProCard = memo(
  function ProCard({ pro }: ProCardProps) {
    const today = useTodayDate();
    const availabilityHint = useMemo(
      () => getAvailabilityHint(pro.availabilitySlots, today),
      [pro.availabilitySlots, today]
    );

    const responseTimeText = useMemo(
      () => formatResponseTime(pro.responseTimeMinutes ?? undefined),
      [pro.responseTimeMinutes]
    );
    const completedJobsText = useMemo(
      () => formatCompletedJobs(pro.completedJobsCount ?? 0),
      [pro.completedJobsCount]
    );

    return (
      <Link href={`/pros/${pro.id}`} className="block">
        <Card className="shadow-md hover:shadow-lg active:shadow-xl transition-shadow h-full cursor-pointer">
          <div className="flex gap-4 p-4">
            {/* Left: Avatar */}
            <Avatar avatarUrl={pro.avatarUrl} name={pro.name} size="lg" />

            {/* Center: Content */}
            <div className="flex-1 min-w-0 space-y-1">
              {/* First row: Name + Rating (stars) */}
              <div className="flex items-center gap-2">
                <Text variant="h2" className="text-text truncate">
                  {pro.name}
                </Text>
                {pro.rating !== undefined && pro.rating > 0 && (
                  <div className="shrink-0">
                    <RatingStars rating={pro.rating} />
                  </div>
                )}
              </div>

              {/* Second row: isTop + rating number + review count */}
              <div className="flex items-center gap-2 flex-wrap">
                {pro.isTopPro && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Award className="w-4 h-4 text-warning" />
                    <Badge variant="warning" className="shrink-0">
                      Top Pro
                    </Badge>
                  </div>
                )}
                {pro.rating !== undefined && pro.rating > 0 && (
                  <>
                    <Text variant="small" className="text-muted">
                      {pro.rating.toFixed(1)}
                    </Text>
                    <Text variant="small" className="text-muted">
                      ({pro.reviewCount})
                    </Text>
                  </>
                )}
              </div>

              {/* Third row: Availability + Response time */}
              <div className="flex items-center gap-3 flex-wrap">
                {availabilityHint && (
                  <div className="flex items-center gap-1">
                    {availabilityHint === "today" ? (
                      <Clock className="w-4 h-4 text-primary" />
                    ) : (
                      <Calendar className="w-4 h-4 text-primary" />
                    )}
                    <Text variant="small" className="text-muted">
                      {availabilityHint === "today"
                        ? "Disponible hoy"
                        : "Disponible mañana"}
                    </Text>
                  </div>
                )}
                {responseTimeText && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted" />
                    <Text variant="small" className="text-muted">
                      {responseTimeText}
                    </Text>
                  </div>
                )}
              </div>

              {/* Fourth row: Completed Jobs */}
              {pro.completedJobsCount > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-muted" />
                  <Text variant="small" className="text-muted">
                    {completedJobsText}
                  </Text>
                </div>
              )}

              {/* Fifth row: Location */}
              {pro.serviceArea && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted" />
                  <Text variant="small" className="text-muted">
                    {pro.serviceArea}
                  </Text>
                </div>
              )}
            </div>

            {/* Right: Rate + Button */}
            <div className="flex flex-col justify-between items-end shrink-0 gap-3">
              {/* Top: Rate/hour */}
              <div className="text-right">
                <Text variant="small" className="text-text font-medium">
                  ${pro.hourlyRate.toFixed(0)}/hora
                </Text>
              </div>

              {/* Bottom: View Profile button */}
              <div onClick={(e) => e.stopPropagation()}>
                <Button variant="primary" className="w-full">
                  Ver perfil
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
      prevProps.pro.id === nextProps.pro.id &&
      prevProps.pro.name === nextProps.pro.name &&
      prevProps.pro.avatarUrl === nextProps.pro.avatarUrl &&
      prevProps.pro.rating === nextProps.pro.rating &&
      prevProps.pro.reviewCount === nextProps.pro.reviewCount &&
      prevProps.pro.completedJobsCount === nextProps.pro.completedJobsCount &&
      prevProps.pro.isTopPro === nextProps.pro.isTopPro &&
      prevProps.pro.responseTimeMinutes === nextProps.pro.responseTimeMinutes &&
      prevProps.pro.hourlyRate === nextProps.pro.hourlyRate &&
      prevProps.pro.serviceArea === nextProps.pro.serviceArea &&
      prevProps.pro.availabilitySlots?.length ===
        nextProps.pro.availabilitySlots?.length
    );
  }
);
