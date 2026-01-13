import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

export function WhatsAppPromptCard() {
  return (
    <Card className="p-4 mb-6 bg-accent/10 border-accent/20">
      <Text variant="body" className="mb-3 text-text">
        ¿Querés recibir avisos por WhatsApp?
      </Text>
      <Link href="/settings">
        <Button variant="secondary" className="w-full sm:w-auto">
          Configurar
        </Button>
      </Link>
    </Card>
  );
}
