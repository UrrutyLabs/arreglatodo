import { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Text } from "../../components/ui/Text";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme";
import { supabase } from "../../lib/supabase/client";

export function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Sign up with Supabase
      // Store intendedRole in user metadata so API can create user with PRO role
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            intendedRole: "pro", // This app is for professionals
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Error al registrarse");
        return;
      }

      // Step 2: Check if session is available (email confirmation disabled)
      if (data.session) {
        // Email confirmation disabled - user is signed in automatically
        router.replace("/onboarding");
        return;
      }

      // Step 3: Email confirmation enabled - redirect to confirmation screen
      router.replace({
        pathname: "/auth/confirm-email",
        params: { email },
      });
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
    <ScrollView contentContainerStyle={styles.container}>
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
          onPress={handleSignUp}
          disabled={loading}
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
