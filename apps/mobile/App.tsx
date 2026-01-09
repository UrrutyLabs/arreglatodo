import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { TRPCProvider } from "./components/TRPCProvider";
import { trpc } from "./utils/trpc";

function HealthCheck() {
  const { data, isLoading, error } = trpc.health.ping.useQuery();

  return (
    <View style={styles.content}>
      <Text style={styles.title}>ArreglaTodo - Mobile</Text>
      <Text style={styles.subtitle}>tRPC Health Check</Text>

      {isLoading && (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.statusText}>Loading...</Text>
        </View>
      )}

      {error && (
        <View style={styles.statusContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </View>
      )}

      {data && (
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, data.ok && styles.success]}>
            {data.ok ? "✓ OK" : "✗ Error"}
          </Text>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{data.time.toLocaleString()}</Text>
          <Text style={styles.timestamp}>{data.time.toISOString()}</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <TRPCProvider>
      <View style={styles.container}>
        <HealthCheck />
        <StatusBar style="auto" />
      </View>
    </TRPCProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    color: "#666",
  },
  statusContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  statusText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    color: "#333",
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    color: "#000",
  },
  success: {
    color: "#34C759",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 8,
    color: "#999",
    fontFamily: "monospace",
  },
});
