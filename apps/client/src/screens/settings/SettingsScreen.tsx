"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Navigation } from "@/components/presentational/Navigation";
import { useClientProfile } from "@/hooks/useClientProfile";
import type { PreferredContactMethod } from "@repo/domain";

export function SettingsScreen() {
  const router = useRouter();

  // Fetch current profile
  const { profile, isLoading } = useClientProfile();

  // Derive initial form values from profile
  const initialValues = useMemo(
    () => ({
      phone: profile?.phone || "",
      preferredContactMethod: (profile?.preferredContactMethod || "") as
        | PreferredContactMethod
        | "",
    }),
    [profile]
  );

  const [phone, setPhone] = useState(initialValues.phone);
  const [preferredContactMethod, setPreferredContactMethod] =
    useState<PreferredContactMethod | "">(initialValues.preferredContactMethod);

  // Update mutation
  const updateMutation = trpc.clientProfile.update.useMutation({
    onSuccess: () => {
      router.push("/my-bookings");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      phone: phone || null,
      preferredContactMethod:
        (preferredContactMethod as PreferredContactMethod) || null,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navigation showLogin={false} showProfile={true} />
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <Text variant="body" className="text-muted">
                Cargando...
              </Text>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navigation showLogin={false} showProfile={true} />
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Text variant="h1" className="mb-6 text-primary">
            Notificaciones
          </Text>

          <Card className="p-6">
            <form
              key={profile?.id || "new"}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {profile?.email && (
                <div className="space-y-2">
                  <Text variant="small" className="text-muted">
                    Email
                  </Text>
                  <Text variant="body" className="text-text">
                    {profile.email}
                  </Text>
                  <Text variant="xs" className="text-muted">
                    El email no se puede cambiar desde aquí
                  </Text>
                </div>
              )}

              <Input
                label="Teléfono"
                type="tel"
                placeholder="+598..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Select
                label="Método de contacto preferido"
                value={preferredContactMethod}
                onChange={(e) =>
                  setPreferredContactMethod(
                    e.target.value as PreferredContactMethod | ""
                  )
                }
              >
                <option value="">Seleccionar...</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="PHONE">Teléfono</option>
              </Select>

              {updateMutation.error && (
                <Card className="p-4 bg-danger/10 border-danger/20">
                  <Text variant="body" className="text-danger">
                    {updateMutation.error.message ||
                      "No se pudo guardar. Probá de nuevo."}
                  </Text>
                </Card>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
