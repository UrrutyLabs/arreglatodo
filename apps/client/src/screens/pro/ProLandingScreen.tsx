"use client";

import Link from "next/link";
import { Briefcase, CheckCircle, DollarSign, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@repo/ui";
import { Text, Card } from "@repo/ui";
import { ProHeader } from "@/components/pro/ProHeader";
import { ProFooter } from "@/components/pro/ProFooter";

export function ProLandingScreen() {
  return (
    <div className="min-h-screen bg-bg">
      <ProHeader />
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Briefcase className="w-12 h-12 text-primary" />
            <Text variant="h1" className="text-primary">
              Arreglatodo para Profesionales
            </Text>
          </div>
          <Text variant="h2" className="mb-4 text-text max-w-2xl mx-auto">
            Conseguí trabajos sin intermediarios innecesarios
          </Text>
          <Text variant="body" className="mb-8 text-muted max-w-xl mx-auto">
            Sumate a la plataforma líder en servicios para el hogar en Uruguay. 
            Trabajá de forma independiente y gestioná tus reservas desde tu celular.
          </Text>
          <Link href="/pro/signup">
            <Button variant="primary" className="px-8 py-3 text-lg w-full sm:w-auto">
              Registrarme como profesional
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-16 bg-surface">
        <div className="max-w-6xl mx-auto">
          <Text variant="h2" className="text-center mb-12 text-text">
            ¿Por qué elegir Arreglatodo?
          </Text>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
                <Text variant="body" className="text-text font-semibold">
                  Sin intermediarios
                </Text>
              </div>
              <Text variant="body" className="text-muted">
                Cobrá directamente de tus clientes. Sin comisiones ocultas ni tarifas sorpresa.
              </Text>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-primary" />
                <Text variant="body" className="text-text font-semibold">
                  Trabajá a tu ritmo
                </Text>
              </div>
              <Text variant="body" className="text-muted">
                Gestioná tu disponibilidad y aceptá solo los trabajos que querés hacer.
              </Text>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-primary" />
                <Text variant="body" className="text-text font-semibold">
                  Clientes verificados
                </Text>
              </div>
              <Text variant="body" className="text-muted">
                Conectá con clientes que realmente necesitan tus servicios y están dispuestos a pagar.
              </Text>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
                <Text variant="body" className="text-text font-semibold">
                  Gestión simple
                </Text>
              </div>
              <Text variant="body" className="text-muted">
                Todo en un solo lugar: reservas, pagos y comunicación con clientes desde tu celular.
              </Text>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Text variant="h2" className="text-center mb-12 text-text">
            ¿Cómo funciona?
          </Text>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Text variant="body" className="text-primary font-semibold">1</Text>
              </div>
              <div>
                <Text variant="h2" className="mb-2 text-text">
                  Registrate
                </Text>
                <Text variant="body" className="text-muted">
                  Creá tu cuenta y completá tu perfil profesional con tus servicios y tarifas.
                </Text>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Text variant="body" className="text-primary font-semibold">2</Text>
              </div>
              <div>
                <Text variant="h2" className="mb-2 text-text">
                  Recibí solicitudes
                </Text>
                <Text variant="body" className="text-muted">
                  Los clientes te encontrarán y te enviarán solicitudes de trabajo cuando estés disponible.
                </Text>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Text variant="body" className="text-primary font-semibold">3</Text>
              </div>
              <div>
                <Text variant="h2" className="mb-2 text-text">
                  Aceptá y trabajá
                </Text>
                <Text variant="body" className="text-muted">
                  Revisá las solicitudes, aceptá las que te interesen y completá el trabajo.
                </Text>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Text variant="body" className="text-primary font-semibold">4</Text>
              </div>
              <div>
                <Text variant="h2" className="mb-2 text-text">
                  Cobrá
                </Text>
                <Text variant="body" className="text-muted">
                  Recibí el pago directamente de tus clientes. Sin esperas ni complicaciones.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <Text variant="h2" className="mb-4 text-text">
            ¿Listo para empezar?
          </Text>
          <Text variant="body" className="mb-8 text-muted max-w-xl mx-auto">
            Registrate ahora y comenzá a recibir trabajos en los próximos días.
          </Text>
          <Link href="/pro/signup">
            <Button variant="primary" className="px-8 py-3 text-lg flex items-center gap-2 mx-auto">
              Crear cuenta profesional
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
      <ProFooter />
    </div>
  );
}
