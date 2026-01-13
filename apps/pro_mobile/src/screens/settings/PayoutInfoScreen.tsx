import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { trpc } from "../../lib/trpc/client";
import { theme } from "../../theme";

export function PayoutInfoScreen() {
  const [fullName, setFullName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [documentId, setDocumentId] = useState("");

  // Fetch current payout profile
  const { data: profile, isLoading } = trpc.proPayout.getMine.useQuery(undefined, {
    retry: false,
  });

  // Initialize form values when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setBankAccountNumber(profile.bankAccountNumber || "");
      setBankName(profile.bankName || "");
      setDocumentId(profile.documentId || "");
    }
  }, [profile]);

  // Update mutation
  const updateMutation = trpc.proPayout.updateMine.useMutation({
    onSuccess: () => {
      Alert.alert("Guardado", "Tus datos de cobro fueron guardados correctamente.");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "No se pudieron guardar los datos. Por favor, intentá nuevamente.");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      fullName: fullName || null,
      bankAccountNumber: bankAccountNumber || null,
      bankName: bankName || null,
      documentId: documentId || null,
    });
  };

  if (isLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="h1" style={styles.title}>
          Cobros
        </Text>
        <Card style={styles.card}>
          <Text variant="body">Cargando...</Text>
        </Card>
      </ScrollView>
    );
  }

  const isComplete = profile?.isComplete ?? false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="h1" style={styles.title}>
        Cobros
      </Text>

      {/* Status Card */}
      <Card style={styles.card}>
        <Text variant="h2" style={styles.sectionTitle}>
          Estado
        </Text>
        {isComplete ? (
          <Text variant="body" style={styles.successText}>
            Datos completos
          </Text>
        ) : (
          <Text variant="body" style={styles.warningText}>
            Completá tus datos para poder cobrar
          </Text>
        )}
      </Card>

      {/* Form Fields */}
      <Card style={styles.card}>
        <Text variant="h2" style={styles.sectionTitle}>
          Información bancaria
        </Text>

        <Input
          label="Nombre completo"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Ingresá tu nombre completo"
          style={styles.input}
        />

        <Input
          label="Cuenta bancaria"
          value={bankAccountNumber}
          onChangeText={setBankAccountNumber}
          placeholder="Ingresá tu número de cuenta"
          style={styles.input}
          keyboardType="numeric"
        />

        <Input
          label="Banco (opcional)"
          value={bankName}
          onChangeText={setBankName}
          placeholder="Ingresá el nombre del banco"
          style={styles.input}
        />

        <Input
          label="Documento (opcional)"
          value={documentId}
          onChangeText={setDocumentId}
          placeholder="Ingresá tu documento"
          style={styles.input}
        />
      </Card>

      {/* Save Button */}
      <Button
        onPress={handleSave}
        disabled={updateMutation.isPending}
        style={styles.saveButton}
      >
        {updateMutation.isPending ? "Guardando..." : "Guardar"}
      </Button>
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
  title: {
    marginBottom: theme.spacing[6],
    color: theme.colors.primary,
  },
  card: {
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    marginBottom: theme.spacing[3],
    color: theme.colors.text,
  },
  input: {
    marginBottom: theme.spacing[3],
  },
  successText: {
    color: theme.colors.accent,
  },
  warningText: {
    color: theme.colors.muted,
  },
  saveButton: {
    width: "100%",
    marginTop: theme.spacing[2],
  },
});
