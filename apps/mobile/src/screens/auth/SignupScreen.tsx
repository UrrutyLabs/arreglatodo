import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Text } from "../../components/ui/Text";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme";

export function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      await signUp(email, password);
      router.replace("/(tabs)/home");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al registrarse. Por favor, intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text variant="h1" style={styles.title}>
          Registrarse
        </Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="tu@email.com"
        />

        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Tu contraseña"
        />

        {error && (
          <Text variant="small" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          variant="primary"
          onPress={handleSubmit}
          disabled={loading || !email || !password}
          style={styles.button}
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </Button>

        <Button
          variant="ghost"
          onPress={() => router.back()}
          style={styles.linkButton}
        >
          ¿Ya tenés cuenta? Iniciar sesión
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.bg,
    padding: theme.spacing[6],
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: theme.spacing[6],
  },
  title: {
    marginBottom: theme.spacing[6],
    textAlign: "center",
  },
  error: {
    color: theme.colors.danger,
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  button: {
    marginTop: theme.spacing[4],
  },
  linkButton: {
    marginTop: theme.spacing[4],
  },
});
