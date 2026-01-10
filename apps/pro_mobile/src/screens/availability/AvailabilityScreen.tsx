import { View, StyleSheet, Switch } from "react-native";
import { Text } from "../../components/ui/Text";
import { useAvailability } from "../../hooks/useAvailability";
import { theme } from "../../theme";

export function AvailabilityScreen() {
  const { isAvailable, isLoading, error, toggleAvailability, isSaving } = useAvailability();

  return (
    <View style={styles.container}>
      <Text variant="h1" style={styles.title}>
        Disponibilidad
      </Text>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <Text variant="body" style={styles.label}>
            {isAvailable ? "Disponible" : "No disponible"}
          </Text>
          <Switch
            value={isAvailable}
            onValueChange={toggleAvailability}
            disabled={isLoading || isSaving}
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
          <Text variant="small" style={styles.error}>
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing[4],
  },
  title: {
    marginBottom: theme.spacing[6],
  },
  toggleContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing[4],
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[2],
  },
  label: {
    flex: 1,
  },
  helperText: {
    color: theme.colors.muted,
    marginTop: theme.spacing[2],
  },
  error: {
    color: theme.colors.danger,
    marginTop: theme.spacing[2],
  },
});
