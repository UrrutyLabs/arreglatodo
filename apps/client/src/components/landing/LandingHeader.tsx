import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export function LandingHeader() {
  return (
    <header className="px-4 py-4 border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/">
          <Text variant="h2" className="text-primary">
            Arreglatodo
          </Text>
        </Link>
        <Link href="/login">
          <Button variant="ghost" className="px-6">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    </header>
  );
}
