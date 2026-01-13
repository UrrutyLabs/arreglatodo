"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export function ConfirmEmailScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-lg border border-border">
        <Text variant="h1" className="text-center text-text">
          Confirmá tu email
        </Text>

        <div className="space-y-4">
          <Text variant="body" className="text-text text-center">
            Te enviamos un link de confirmación a:
          </Text>

          {email && (
            <Text variant="body" className="text-primary text-center font-medium">
              {email}
            </Text>
          )}

          <Text variant="body" className="text-muted text-center">
            Hacé click en el link del email para confirmar tu cuenta y continuar.
          </Text>

          {resendSuccess && (
            <Text variant="small" className="text-success text-center">
              ✅ Email reenviado. Revisá tu bandeja de entrada.
            </Text>
          )}

          {error && (
            <Text variant="small" className="text-danger text-center">
              {error}
            </Text>
          )}

          <Button
            variant="primary"
            onClick={handleResendEmail}
            disabled={resending || !email}
            className="w-full"
          >
            {resending ? "Reenviando..." : "Reenviar email"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Volver a iniciar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
