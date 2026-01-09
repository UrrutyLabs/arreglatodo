import Link from "next/link";
import { Text } from "@/components/ui/Text";

export function LandingFooter() {
  return (
    <footer className="px-4 py-8 border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Text variant="small" className="text-muted">
            © Arreglatodo — Hecho para resolver lo cotidiano.
          </Text>
          <div className="flex gap-6">
            <Link href="#" className="text-muted hover:text-text transition-colors">
              <Text variant="small">Términos</Text>
            </Link>
            <Link href="#" className="text-muted hover:text-text transition-colors">
              <Text variant="small">Privacidad</Text>
            </Link>
            <Link href="#" className="text-muted hover:text-text transition-colors">
              <Text variant="small">Contacto</Text>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
