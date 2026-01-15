import { View, StyleSheet, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@components/ui/Text";
import { useAvailability } from "@hooks/pro";
import { theme } from "../../theme";

export function AvailabilityScreen() {
  const { isAvailable, isLoading, error, toggleAvailability, isSaving } = useAvailability();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Feather name="calendar" size={24} color={theme.colors.primary} />
        <Text variant="h1" style={styles.title}>
          Disponibilidad
        </Text>
      </View>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <View style={styles.labelRow}>
            {isAvailable ? (
              <Feather name="check-circle" size={20} color={theme.colors.success} />
            ) : (
              <Feather name="x-circle" size={20} color={theme.colors.muted} />
            )}
            <Text variant="body" style={styles.label}>
              {isAvailable ? "Disponible" : "No disponible"}
            </Text>
          </View>
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
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={16} color={theme.colors.danger} />
            <Text variant="small" style={styles.error}>
              {error}
            </Text>
          </View>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  title: {
    marginLeft: theme.spacing[2],
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
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    marginLeft: theme.spacing[2],
  },
  helperText: {
    color: theme.colors.muted,
    marginTop: theme.spacing[2],
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing[2],
    padding: theme.spacing[2],
    backgroundColor: `${theme.colors.danger}1A`,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: `${theme.colors.danger}33`,
  },
  error: {
    marginLeft: theme.spacing[1],
    color: theme.colors.danger,
  },
});
