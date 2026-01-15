import { X, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@repo/ui";
import { Text } from "@repo/ui";
import { Button } from "@repo/ui";

// Export AuthLoadingState and AuthenticatedGuard for convenience
export { AuthLoadingState } from "./AuthLoadingState";
export { AuthenticatedGuard } from "./AuthenticatedGuard";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
  title?: string;
  message?: string;
}

export function AuthPromptModal({
  isOpen,
  onClose,
  returnUrl,
  title = "Iniciá sesión para continuar",
  message = "Necesitás iniciar sesión para realizar esta acción.",
}: AuthPromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const buildUrl = (path: string) => {
    if (returnUrl) {
      return `${path}?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
    return path;
  };

  const handleLogin = () => {
    router.push(buildUrl("/login"));
  };

  const handleSignup = () => {
    router.push(buildUrl("/signup"));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-text transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div>
            <Text variant="h2" className="text-text mb-2">
              {title}
            </Text>
            <Text variant="body" className="text-muted">
              {message}
            </Text>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignup}
              className="w-full flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Crear cuenta
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
