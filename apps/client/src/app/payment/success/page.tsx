import Link from "next/link";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Navigation } from "@/components/presentational/Navigation";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navigation showLogin={false} showProfile={true} />
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <Text variant="h1" className="mb-4 text-primary">
              Pago autorizado
            </Text>
            <Text variant="body" className="mb-6 text-text">
              Pago autorizado. Ya podés seguir con tu reserva.
            </Text>
            <Link href="/my-bookings">
              <Button variant="primary">Ir a mis reservas</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
