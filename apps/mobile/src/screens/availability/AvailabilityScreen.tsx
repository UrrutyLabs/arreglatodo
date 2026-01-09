import { View, StyleSheet, ScrollView, ActivityIndicator, Switch } from "react-native";
import { Text } from "../../components/ui/Text";
import { Card } from "../../components/ui/Card";
import { theme } from "../../theme";
import { useAvailability } from "../../hooks/useAvailability";

export function AvailabilityScreen() {
  const { isAvailable, isLoading, error, toggleAvailability, isSaving } = useAvailability();

  const handleToggle = async () => {
    try {
      await toggleAvailability();
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
            Cargando...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Disponibilidad
      </Text>

      <Card style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabel}>
            <Text variant="body" style={styles.toggleText}>
              {isAvailable ? "Disponible" : "No disponible"}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={handleToggle}
            disabled={isSaving}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.surface}
          />
        </View>

        <Text variant="small" style={styles.helperText}>
          Cuando estás disponible, podés recibir solicitudes.
        </Text>

        {error && (
          <Text variant="small" style={styles.errorText}>
            {error}
          </Text>
        )}
      </Card>
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
    marginBottom: theme.spacing[6],
  },
  card: {
    marginBottom: theme.spacing[4],
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[4],
  },
  toggleLabel: {
    flex: 1,
  },
  toggleText: {
    color: theme.colors.text,
  },
  helperText: {
    color: theme.colors.muted,
    marginTop: theme.spacing[2],
  },
  errorText: {
    color: theme.colors.danger,
    marginTop: theme.spacing[2],
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
});
