import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { Badge } from "../ui/Badge";
import type { Booking } from "@repo/domain";
import { BookingStatus } from "@repo/domain";
import { theme } from "../../theme";

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "Pendiente",
  [BookingStatus.ACCEPTED]: "Aceptada",
  [BookingStatus.REJECTED]: "Rechazada",
  [BookingStatus.COMPLETED]: "Completada",
  [BookingStatus.CANCELLED]: "Cancelada",
};

const STATUS_VARIANTS: Record<
  BookingStatus,
  "success" | "warning" | "danger" | "info"
> = {
  [BookingStatus.PENDING]: "info",
  [BookingStatus.ACCEPTED]: "success",
  [BookingStatus.REJECTED]: "danger",
  [BookingStatus.COMPLETED]: "success",
  [BookingStatus.CANCELLED]: "warning",
};

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: "Plomería",
  electrical: "Electricidad",
  cleaning: "Limpieza",
  handyman: "Arreglos generales",
  painting: "Pintura",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const statusLabel = STATUS_LABELS[booking.status];
  const statusVariant = STATUS_VARIANTS[booking.status];
  const categoryLabel = CATEGORY_LABELS[booking.category] || booking.category;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.category}>
            {categoryLabel}
          </Text>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </View>
        <Text variant="body" style={styles.description} numberOfLines={2}>
          {booking.description}
        </Text>
        <Text variant="small" style={styles.date}>
          {formatDate(booking.scheduledAt)}
        </Text>
        <Text variant="small" style={styles.amount}>
          ${booking.totalAmount.toFixed(0)}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing[3],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing[2],
  },
  category: {
    flex: 1,
  },
  description: {
    color: theme.colors.muted,
    marginBottom: theme.spacing[2],
  },
  date: {
    color: theme.colors.muted,
    marginBottom: theme.spacing[1],
  },
  amount: {
    color: theme.colors.text,
    fontWeight: theme.typography.weights.medium,
    marginTop: theme.spacing[2],
  },
});
