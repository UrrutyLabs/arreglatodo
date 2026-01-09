import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

export function LandingWhyArreglatodo() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <Text variant="h2" className="text-center mb-12 text-text">
          Por qué Arreglatodo
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Text variant="h2" className="mb-2 text-text">
              Profesionales verificados
            </Text>
            <Text variant="body" className="text-muted">
              Todos los profesionales pasan por un proceso de verificación para garantizar calidad y confianza.
            </Text>
          </Card>

          <Card>
            <Text variant="h2" className="mb-2 text-text">
              Precios claros
            </Text>
            <Text variant="body" className="text-muted">
              Sabés cuánto vas a pagar antes de confirmar. Sin sorpresas, sin costos ocultos.
            </Text>
          </Card>

          <Card>
            <Text variant="h2" className="mb-2 text-text">
              Pagos seguros
            </Text>
            <Text variant="body" className="text-muted">
              Pagás solo cuando el trabajo está completo. Tu dinero está protegido hasta entonces.
            </Text>
          </Card>

          <Card>
            <Text variant="h2" className="mb-2 text-text">
              Soporte local
            </Text>
            <Text variant="body" className="text-muted">
              Estamos acá, en Uruguay. Conocés a quién contactar si necesitás ayuda.
            </Text>
          </Card>
        </div>
      </div>
    </section>
  );
}
