import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert, TouchableOpacity, View, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { Text } from "@components/ui/Text";
import { useAuth } from "@hooks/auth";
import { trpc } from "@lib/trpc/client";
import { useQueryClient } from "@hooks/shared";
import { invalidateRelatedQueries } from "@lib/react-query/utils";
import { theme } from "../../theme";

export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [bio, setBio] = useState("");
  const queryClient = useQueryClient();

  // Fetch current pro profile
  const { data: pro, isLoading: isLoadingProfile } = trpc.pro.getMyProfile.useQuery(undefined, {
    retry: false,
  });

  // Initialize bio from profile when it loads
  useEffect(() => {
    if (pro) {
      setBio(pro.bio || "");
    }
  }, [pro]);

  // Update mutation with query invalidation
  const updateMutation = trpc.pro.updateProfile.useMutation({
    ...invalidateRelatedQueries(queryClient, [
      [["pro", "getMyProfile"]],
      [["pro", "getById"]], // Invalidate public profile queries too
    ]),
    onSuccess: () => {
      Alert.alert("Guardado", "Tu biografía fue guardada correctamente.");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "No se pudo guardar la biografía. Por favor, intentá nuevamente.");
    },
  });

  const handleSaveBio = () => {
    updateMutation.mutate({
      bio: bio || undefined, // Convert empty string to undefined for optional field
    });
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que querés cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSigningOut(true);
              await signOut();
              router.replace("/auth/login");
            } catch {
              Alert.alert(
                "Error",
                "No se pudo cerrar sesión. Por favor, intentá nuevamente."
              );
            } finally {
              setIsSigningOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.titleRow}>
        <Feather name="user" size={24} color={theme.colors.primary} />
        <Text variant="h1" style={styles.title}>
          Perfil
        </Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Feather name="user" size={20} color={theme.colors.primary} />
          <Text variant="h2" style={styles.sectionTitle}>
            Información de cuenta
          </Text>
        </View>
        {user?.email && (
          <View style={styles.emailRow}>
            <Feather name="mail" size={16} color={theme.colors.muted} />
            <Text variant="body" style={styles.email}>
              {user.email}
            </Text>
          </View>
        )}
      </Card>

      {/* Bio Section */}
      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <Feather name="file-text" size={20} color={theme.colors.primary} />
          <Text variant="h2" style={styles.sectionTitle}>
            Biografía
          </Text>
        </View>
        <Text variant="body" style={styles.bioDescription}>
          Contá a tus clientes sobre tu experiencia, especialidades y lo que te hace único.
        </Text>
        <View style={styles.bioInputContainer}>
          <TextInput
            style={styles.bioInput}
            placeholder="Escribí tu biografía aquí..."
            placeholderTextColor={theme.colors.muted}
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={6}
            maxLength={1000}
            textAlignVertical="top"
          />
          <View style={styles.bioFooter}>
            <Text variant="xs" style={styles.bioHint}>
              La biografía es opcional y aparecerá en tu perfil público
            </Text>
            <Text variant="xs" style={styles.bioCounter}>
              {bio.length}/1000
            </Text>
          </View>
        </View>
        <Button
          onPress={handleSaveBio}
          disabled={updateMutation.isPending || isLoadingProfile}
          style={styles.saveBioButton}
        >
          {updateMutation.isPending ? "Guardando..." : "Guardar biografía"}
        </Button>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => router.push("/settings/payout")}
          style={styles.linkRow}
        >
          <View style={styles.linkLeft}>
            <Feather name="credit-card" size={20} color={theme.colors.text} />
            <Text variant="body" style={styles.linkText}>
              Configuración de cobros
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.muted} />
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => router.push("/settings/help")}
          style={styles.linkRow}
        >
          <View style={styles.linkLeft}>
            <Feather name="help-circle" size={20} color={theme.colors.text} />
            <Text variant="body" style={styles.linkText}>
              Ayuda
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.colors.muted} />
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <Button
          variant="danger"
          onPress={handleSignOut}
          disabled={isSigningOut}
          style={styles.signOutButton}
        >
          {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </Button>
      </Card>
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing[6],
  },
  title: {
    marginLeft: theme.spacing[2],
    color: theme.colors.primary,
  },
  card: {
    marginBottom: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing[2],
  },
  sectionTitle: {
    marginLeft: theme.spacing[2],
    color: theme.colors.text,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  email: {
    marginLeft: theme.spacing[1],
    color: theme.colors.muted,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkText: {
    marginLeft: theme.spacing[2],
    color: theme.colors.text,
  },
  signOutButton: {
    width: "100%",
  },
  bioDescription: {
    marginBottom: theme.spacing[2],
    color: theme.colors.muted,
  },
  bioInputContainer: {
    marginBottom: theme.spacing[3],
  },
  bioInput: {
    minHeight: 120,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body.fontSize,
  },
  bioFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing[1],
  },
  bioHint: {
    flex: 1,
    color: theme.colors.muted,
  },
  bioCounter: {
    color: theme.colors.muted,
    marginLeft: theme.spacing[2],
  },
  saveBioButton: {
    width: "100%",
  },
});
