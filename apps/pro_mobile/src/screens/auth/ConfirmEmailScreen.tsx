import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { theme } from "../../theme";
import { supabase } from "../../lib/supabase/client";

export function ConfirmEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = params.email || "";

  const handleResendEmail = async () => {
    if (!email) {
      setError("No se encontró el email");
      return;
    }

    try {
      setResending(true);
      setError(null);
      setResendSuccess(false);

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (resendError) {
        setError(resendError.message || "Error al reenviar el email");
        return;
      }

      setResendSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al reenviar el email. Por favor, intentá nuevamente."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text variant="h1" style={styles.title}>
          Confirmá tu email
        </Text>
        <Text variant="body" style={styles.message}>
          Te enviamos un link de confirmación a:
        </Text>
        {email && (
          <Text variant="body" style={styles.email}>
            {email}
          </Text>
        )}
        <Text variant="body" style={styles.instructions}>
          Hacé click en el link del email para confirmar tu cuenta y continuar.
        </Text>

        {resendSuccess && (
          <Text variant="small" style={styles.success}>
            ✅ Email reenviado. Revisá tu bandeja de entrada.
          </Text>
        )}

        {error && (
          <Text variant="small" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          variant="primary"
          onPress={handleResendEmail}
          disabled={resending || !email}
          style={styles.button}
        >
          {resending ? "Reenviando..." : "Reenviar email"}
        </Button>

        <Button
          variant="ghost"
          onPress={() => router.replace("/auth/login")}
          style={styles.linkButton}
        >
          Volver a iniciar sesión
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  card: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    marginBottom: theme.spacing[4],
    textAlign: "center",
  },
  message: {
    marginBottom: theme.spacing[2],
    textAlign: "center",
    color: theme.colors.text,
  },
  email: {
    marginBottom: theme.spacing[4],
    textAlign: "center",
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  instructions: {
    marginBottom: theme.spacing[6],
    textAlign: "center",
    color: theme.colors.muted,
  },
  button: {
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  linkButton: {
    marginTop: theme.spacing[2],
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing[2],
    textAlign: "center",
  },
  success: {
    color: theme.colors.success,
    marginBottom: theme.spacing[2],
    textAlign: "center",
  },
});
