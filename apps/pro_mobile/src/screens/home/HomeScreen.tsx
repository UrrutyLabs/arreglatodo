import { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { BookingCard } from "../../components/presentational/BookingCard";
import { trpc } from "../../lib/trpc/client";
import { BookingStatus } from "../../types/domain";
import { theme } from "../../theme";

export function HomeScreen() {
  const router = useRouter();
  const { data: bookings, isLoading, error } = (trpc as any).booking.proInbox.useQuery();

  const pendingBookings = useMemo(() => {
    return bookings?.filter((b: any) => b.status === BookingStatus.PENDING) || [];
  }, [bookings]);

  const acceptedBookings = useMemo(() => {
    return bookings?.filter((b: any) => b.status === BookingStatus.ACCEPTED) || [];
  }, [bookings]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" style={styles.loadingText}>
          Cargando...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text variant="body" style={styles.error}>
          Error al cargar trabajos
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text variant="h2" style={styles.sectionTitle}>
          Solicitudes nuevas
        </Text>
        {pendingBookings.length === 0 ? (
          <Text variant="body" style={styles.empty}>
            No hay solicitudes nuevas
          </Text>
        ) : (
          pendingBookings.map((booking: any) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => router.push(`/booking/${booking.id}` as any)}
            />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text variant="h2" style={styles.sectionTitle}>
          Próximos trabajos
        </Text>
        {acceptedBookings.length === 0 ? (
          <Text variant="body" style={styles.empty}>
            No hay trabajos próximos
          </Text>
        ) : (
          acceptedBookings.map((booking: any) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => router.push(`/booking/${booking.id}` as any)}
            />
          ))
        )}
      </View>
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
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
  },
  empty: {
    color: theme.colors.muted,
    textAlign: "center",
    paddingVertical: theme.spacing[4],
  },
});
