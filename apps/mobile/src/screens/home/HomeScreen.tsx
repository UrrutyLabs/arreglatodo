import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text } from "../../components/ui/Text";
import { BookingCard } from "../../components/presentational/BookingCard";
import { theme } from "../../theme";
import { trpc } from "../../lib/trpc/client";
import { BookingStatus } from "@repo/domain";

export function HomeScreen() {
  const router = useRouter();
  
  // Fetch pro inbox bookings
  const { data: bookings = [], isLoading, error } = trpc.booking.proInbox.useQuery(
    undefined,
    { retry: false, refetchOnWindowFocus: false }
  );

  // Filter bookings into pending and accepted
  const { pending, upcoming } = useMemo(() => {
    const pendingBookings = bookings.filter(
      (booking) => booking.status === BookingStatus.PENDING
    );
    
    const upcomingBookings = bookings.filter(
      (booking) => booking.status === BookingStatus.ACCEPTED
    );

    return {
      pending: pendingBookings,
      upcoming: upcomingBookings,
    };
  }, [bookings]);

  const handleCardPress = (bookingId: string) => {
    router.push(`/booking/${bookingId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Inicio
      </Text>
      <Text variant="body" style={styles.subtitle}>
        Bandeja de trabajos
      </Text>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="body" style={styles.loadingText}>
            Cargando...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Text variant="body" style={styles.errorText}>
            Error al cargar trabajos
          </Text>
        </View>
      ) : (
        <>
          {/* Pending Requests Section */}
          <View style={styles.section}>
            <Text variant="h2" style={styles.sectionTitle}>
              Solicitudes nuevas
            </Text>
            {pending.length === 0 ? (
              <Text variant="body" style={styles.emptyText}>
                No hay solicitudes nuevas
              </Text>
            ) : (
              pending.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onPress={() => handleCardPress(booking.id)}
                />
              ))
            )}
          </View>

          {/* Upcoming Jobs Section */}
          <View style={styles.section}>
            <Text variant="h2" style={styles.sectionTitle}>
              Próximos trabajos
            </Text>
            {upcoming.length === 0 ? (
              <Text variant="body" style={styles.emptyText}>
                No hay trabajos próximos
              </Text>
            ) : (
              upcoming.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onPress={() => handleCardPress(booking.id)}
                />
              ))
            )}
          </View>
        </>
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
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    marginBottom: theme.spacing[6],
    color: theme.colors.muted,
  },
  section: {
    marginBottom: theme.spacing[8],
  },
  sectionTitle: {
    marginBottom: theme.spacing[4],
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
  emptyText: {
    color: theme.colors.muted,
    textAlign: "center",
    paddingVertical: theme.spacing[4],
  },
});
