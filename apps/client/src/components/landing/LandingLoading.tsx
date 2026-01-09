import { Text } from "@/components/ui/Text";

export function LandingLoading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <Text variant="body" className="text-muted">
        Cargando...
      </Text>
    </div>
  );
}
