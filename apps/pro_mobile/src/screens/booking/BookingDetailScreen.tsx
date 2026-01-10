import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useBookingActions } from "../../hooks/useBookingActions";
import { trpc } from "../../lib/trpc/client";
import { BookingStatus, Category } from "../../types/domain";
import { theme } from "../../theme";

const categoryLabels: Record<string, string> = {
  [Category.PLUMBING]: "Plomería",
  [Category.ELECTRICAL]: "Electricidad",
  [Category.CLEANING]: "Limpieza",
  [Category.HANDYMAN]: "Arreglos generales",
  [Category.PAINTING]: "Pintura",
};

const statusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "Pendiente",
  [BookingStatus.ACCEPTED]: "Aceptada",
  [BookingStatus.REJECTED]: "Rechazada",
  [BookingStatus.COMPLETED]: "Completada",
  [BookingStatus.CANCELLED]: "Cancelada",
};

const statusVariants: Record<BookingStatus, "success" | "warning" | "danger" | "info"> = {
  [BookingStatus.PENDING]: "info",
  [BookingStatus.ACCEPTED]: "success",
  [BookingStatus.REJECTED]: "danger",
  [BookingStatus.COMPLETED]: "success",
  [BookingStatus.CANCELLED]: "warning",
};

export function BookingDetailScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { data: booking, isLoading, error, refetch } = (trpc as any).booking.getById.useQuery({
    id: bookingId!,
  });

  const {
    acceptBooking,
    rejectBooking,
    completeBooking,
    isAccepting,
    isRejecting,
    isCompleting,
    error: actionError,
  } = useBookingActions({
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" style={styles.loadingText}>
          Cargando reserva...
        </Text>
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.center}>
        <Text variant="body" style={styles.error}>
          {error?.message || "Reserva no encontrada"}
        </Text>
      </View>
    );
  }

  const categoryLabel = categoryLabels[booking.category] || booking.category;
  const statusLabel = statusLabels[booking.status as BookingStatus];
  const statusVariant = statusVariants[booking.status as BookingStatus];

  const formattedDate = new Intl.DateTimeFormat("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(booking.scheduledAt));

  const canAccept = booking.status === BookingStatus.PENDING;
  const canReject = booking.status === BookingStatus.PENDING;
  const canComplete = booking.status === BookingStatus.ACCEPTED;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="h1">Detalle de reserva</Text>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </View>

      <Card style={styles.card}>
        <Text variant="h2" style={styles.sectionTitle}>
          Resumen
        </Text>
        <View style={styles.row}>
          <Text variant="small" style={styles.label}>
            Categoría:
          </Text>
          <Text variant="body">{categoryLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="small" style={styles.label}>
            Fecha y hora:
          </Text>
          <Text variant="body">{formattedDate}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="small" style={styles.label}>
            Horas estimadas:
          </Text>
          <Text variant="body">{booking.estimatedHours}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="small" style={styles.label}>
            Descripción:
          </Text>
          <Text variant="body" style={styles.description}>
            {booking.description}
          </Text>
        </View>
        <View style={styles.row}>
          <Text variant="small" style={styles.label}>
            Total estimado:
          </Text>
          <Text variant="h2" style={styles.amount}>
            ${booking.totalAmount.toFixed(2)}
          </Text>
        </View>
      </Card>

      {(canAccept || canReject || canComplete) && (
        <View style={styles.actions}>
          <Text variant="h2" style={styles.sectionTitle}>
            Acciones
          </Text>
          {actionError && (
            <Text variant="small" style={styles.error}>
              {actionError}
            </Text>
          )}
          {canAccept && (
            <Button
              variant="primary"
              onPress={() => acceptBooking(booking.id)}
              disabled={isAccepting || isRejecting || isCompleting}
              style={styles.actionButton}
            >
              {isAccepting ? "Aceptando..." : "Aceptar"}
            </Button>
          )}
          {canReject && (
            <Button
              variant="danger"
              onPress={() => rejectBooking(booking.id)}
              disabled={isAccepting || isRejecting || isCompleting}
              style={styles.actionButton}
            >
              {isRejecting ? "Rechazando..." : "Rechazar"}
            </Button>
          )}
          {canComplete && (
            <Button
              variant="primary"
              onPress={() => completeBooking(booking.id)}
              disabled={isAccepting || isRejecting || isCompleting}
              style={styles.actionButton}
            >
              {isCompleting ? "Completando..." : "Marcar como completado"}
            </Button>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing[4],
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.bg,
  },
  loadingText: {
    marginTop: theme.spacing[2],
    color: theme.colors.muted,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing[2],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[4],
  },
  card: {
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
  },
  row: {
    marginBottom: theme.spacing[3],
  },
  label: {
    color: theme.colors.muted,
    marginBottom: theme.spacing[1],
  },
  description: {
    marginTop: theme.spacing[1],
  },
  amount: {
    color: theme.colors.primary,
    marginTop: theme.spacing[1],
  },
  actions: {
    marginTop: theme.spacing[4],
  },
  actionButton: {
    marginBottom: theme.spacing[2],
  },
});
