import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface NavigationProps {
  showLogin?: boolean;
  showProfile?: boolean;
}

export function Navigation({ showLogin = true, showProfile = false }: NavigationProps) {
  return (
    <nav className="px-4 py-4 border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/">
          <Text variant="h2" className="text-primary">
            Arreglatodo
          </Text>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" className="px-4">
              Buscar
            </Button>
          </Link>
          <Link href="/my-bookings">
            <Button variant="ghost" className="px-4">
              Mis reservas
            </Button>
          </Link>
          {showLogin && (
            <Link href="/login">
              <Button variant="ghost" className="px-4">
                Login
              </Button>
            </Link>
          )}
          {showProfile && (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Text variant="xs" className="text-primary">
                U
              </Text>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
