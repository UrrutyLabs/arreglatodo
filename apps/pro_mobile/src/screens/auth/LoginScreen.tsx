import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme";

export function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signIn(email, password);
      // Redirect to index route, which will check onboarding status and redirect appropriately
      router.replace("/" as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text variant="h1" style={styles.title}>
          Iniciar sesión
        </Text>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
        />
        <Input
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          style={styles.input}
        />
        {error && (
          <Text variant="small" style={styles.error}>
            {error}
          </Text>
        )}
        <Button
          variant="primary"
          onPress={handleSignIn}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Iniciando sesión..." : "Ingresar"}
        </Button>
        <Button
          variant="ghost"
          onPress={() => router.push("/auth/signup" as any)}
          style={styles.linkButton}
        >
          ¿No tenés cuenta? Registrate
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
    marginBottom: theme.spacing[6],
    textAlign: "center",
  },
  input: {
    marginBottom: theme.spacing[4],
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
  },
});
