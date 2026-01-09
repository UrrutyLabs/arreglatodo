import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { theme } from "../../theme";
import { trpc } from "../../lib/trpc/client";
import { BookingStatus } from "@repo/domain";
import { useBookingActions } from "../../hooks/useBookingActions";
import { useState } from "react";

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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [localStatus, setLocalStatus] = useState<BookingStatus | null>(null);

  // Fetch booking by id
  const { data: booking, isLoading, error, refetch } = trpc.booking.getById.useQuery(
    { id: bookingId || "" },
    { enabled: !!bookingId, retry: false }
  );
  
  const { acceptBooking, rejectBooking, completeBooking, isAccepting, isRejecting, isCompleting, error: actionError } = useBookingActions(() => {
    // Refetch booking data after successful action
    refetch();
  });

  // Use local status if set, otherwise use booking status
  const displayStatus = localStatus || booking?.status;

  const handleAccept = async () => {
    if (!bookingId) return;
    try {
      await acceptBooking(bookingId);
      setLocalStatus(BookingStatus.ACCEPTED);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleReject = async () => {
    if (!bookingId) return;
    try {
      await rejectBooking(bookingId);
      setLocalStatus(BookingStatus.REJECTED);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleComplete = async () => {
    if (!bookingId) return;
    try {
      await completeBooking(bookingId);
      setLocalStatus(BookingStatus.COMPLETED);
    } catch (err) {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="body" style={styles.loadingText}>
            Cargando reserva...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text variant="body" style={styles.errorText}>
            {error.message || "Error al cargar la reserva"}
          </Text>
        </View>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text variant="body" style={styles.errorText}>
            Reserva no encontrada
          </Text>
        </View>
      </View>
    );
  }

  const statusLabel = displayStatus ? STATUS_LABELS[displayStatus] : "";
  const statusVariant = displayStatus ? STATUS_VARIANTS[displayStatus] : "info";
  const categoryLabel = CATEGORY_LABELS[booking.category] || booking.category;

  const canAccept = displayStatus === BookingStatus.PENDING;
  const canReject = displayStatus === BookingStatus.PENDING;
  const canComplete = displayStatus === BookingStatus.ACCEPTED;
  const isReadOnly = displayStatus === BookingStatus.COMPLETED || displayStatus === BookingStatus.CANCELLED || displayStatus === BookingStatus.REJECTED;

  return (
    <ScrollView style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Detalle de reserva
      </Text>

      {/* Status Badge */}
      <Badge variant={statusVariant} style={styles.statusBadge}>
        {statusLabel}
      </Badge>

      {/* Booking Summary */}
      <Card style={styles.card}>
        <Text variant="h2" style={styles.sectionTitle}>
          Resumen
        </Text>

        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.label}>
            Categoría:
          </Text>
          <Text variant="body" style={styles.value}>
            {categoryLabel}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.label}>
            Fecha y hora:
          </Text>
          <Text variant="body" style={styles.value}>
            {formatDate(booking.scheduledAt)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.label}>
            Horas estimadas:
          </Text>
          <Text variant="body" style={styles.value}>
            {booking.estimatedHours}
          </Text>
        </View>

        <View style={styles.descriptionRow}>
          <Text variant="body" style={styles.label}>
            Descripción:
          </Text>
          <Text variant="body" style={styles.descriptionText}>
            {booking.description}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text variant="body" style={styles.label}>
            Total estimado:
          </Text>
          <Text variant="h2" style={styles.totalAmount}>
            ${booking.totalAmount.toFixed(0)}
          </Text>
        </View>
      </Card>

      {/* Actions */}
      {actionError && (
        <Card style={styles.errorCard}>
          <Text variant="small" style={styles.errorText}>
            {actionError}
          </Text>
        </Card>
      )}

      {!isReadOnly && (
        <Card style={styles.actionsCard}>
          <Text variant="h2" style={styles.sectionTitle}>
            Acciones
          </Text>

          {canAccept && (
            <Button
              variant="primary"
              onPress={handleAccept}
              disabled={isAccepting || isRejecting}
              style={styles.actionButton}
            >
              {isAccepting ? "Aceptando..." : "Aceptar"}
            </Button>
          )}

          {canReject && (
            <Button
              variant="danger"
              onPress={handleReject}
              disabled={isAccepting || isRejecting}
              style={styles.actionButton}
            >
              {isRejecting ? "Rechazando..." : "Rechazar"}
            </Button>
          )}

          {canComplete && (
            <Button
              variant="primary"
              onPress={handleComplete}
              disabled={isCompleting}
              style={styles.actionButton}
            >
              {isCompleting ? "Completando..." : "Marcar como completado"}
            </Button>
          )}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing[6],
    backgroundColor: theme.colors.bg,
  },
  title: {
    marginBottom: theme.spacing[4],
  },
  statusBadge: {
    marginBottom: theme.spacing[6],
    alignSelf: "flex-start",
  },
  card: {
    marginBottom: theme.spacing[4],
  },
  actionsCard: {
    marginBottom: theme.spacing[4],
  },
  errorCard: {
    marginBottom: theme.spacing[4],
    backgroundColor: `${theme.colors.danger}1A`,
    borderColor: theme.colors.danger,
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing[3],
    alignItems: "flex-start",
  },
  label: {
    color: theme.colors.muted,
    flex: 1,
  },
  value: {
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  descriptionRow: {
    marginBottom: theme.spacing[3],
  },
  descriptionText: {
    color: theme.colors.text,
    marginTop: theme.spacing[1],
  },
  totalAmount: {
    color: theme.colors.primary,
    textAlign: "right",
  },
  actionButton: {
    marginBottom: theme.spacing[3],
    width: "100%",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing[8],
  },
  loadingText: {
    marginTop: theme.spacing[4],
    color: theme.colors.muted,
  },
  errorText: {
    color: theme.colors.danger,
  },
});
