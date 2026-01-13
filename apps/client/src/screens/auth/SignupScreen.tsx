"use client";

import { useState } from "react";
import { useSignup } from "@/hooks/useSignup";
import { AuthForm } from "@/components/forms/AuthForm";
import { Text } from "@/components/ui/Text";

export function SignupScreen() {
  const { signup, isPending, error } = useSignup();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await signup({
      email,
      password,
      firstName: firstName || null,
      lastName: lastName || null,
      phone: phone || null,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-lg border border-border">
        <Text variant="h1" className="text-center text-text">
          Registrarse
        </Text>
        <AuthForm
          mode="signup"
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onPhoneChange={setPhone}
          onSubmit={handleSubmit}
          loading={isPending}
          error={error?.message || null}
          footerLink={{
            text: "¿Ya tenés cuenta?",
            linkText: "Iniciar sesión",
            href: "/login",
          }}
        />
      </div>
    </div>
  );
}
