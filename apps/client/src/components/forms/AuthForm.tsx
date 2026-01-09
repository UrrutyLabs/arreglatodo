import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";

interface AuthFormProps {
  mode: "login" | "signup";
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
  footerLink?: {
    text: string;
    linkText: string;
    href: string;
  };
}

export function AuthForm({
  mode,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading = false,
  error,
  footerLink,
}: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
      />
      {error && (
        <Text variant="small" className="text-danger">
          {error}
        </Text>
      )}
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading
          ? isLogin
            ? "Iniciando sesión..."
            : "Registrando..."
          : isLogin
            ? "Ingresar"
            : "Crear cuenta"}
      </Button>
      {footerLink && (
        <Text variant="small" className="text-center text-muted">
          {footerLink.text}{" "}
          <a href={footerLink.href} className="text-primary hover:underline">
            {footerLink.linkText}
          </a>
        </Text>
      )}
    </form>
  );
}
