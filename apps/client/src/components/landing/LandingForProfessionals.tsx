import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

export function LandingForProfessionals() {
  return (
    <section className="px-4 py-16 bg-surface">
      <div className="max-w-4xl mx-auto text-center">
        <Text variant="h2" className="mb-4 text-text">
          ¿Sos profesional?
        </Text>
        <Text variant="body" className="mb-8 text-muted max-w-2xl mx-auto">
          Sumate a Arreglatodo y conseguí trabajos sin intermediarios innecesarios.
        </Text>
        <Link href="/login">
          <Button variant="primary" className="px-8 py-3 text-lg">
            Registrarme como profesional
          </Button>
        </Link>
      </div>
    </section>
  );
}
