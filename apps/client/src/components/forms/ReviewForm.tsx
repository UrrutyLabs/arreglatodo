import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface ReviewFormProps {
  rating: number;
  comment: string;
  onRatingChange: (value: number) => void;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  error?: string | null;
}

export function ReviewForm({
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  loading = false,
  error,
}: ReviewFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Calificación
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onRatingChange(value)}
              className={`w-12 h-12 rounded-md border-2 transition-colors ${
                rating >= value
                  ? "bg-warning border-warning text-white"
                  : "bg-surface border-border text-muted hover:border-warning/50"
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
        {rating > 0 && (
          <Text variant="small" className="text-muted mt-1">
            {rating} {rating === 1 ? "estrella" : "estrellas"}
          </Text>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">
          Comentario (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Contanos tu experiencia con el servicio..."
        />
      </div>

      {error && (
        <Text variant="small" className="text-danger">
          {error}
        </Text>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={loading || rating === 0}>
        {loading ? "Enviando reseña..." : "Enviar reseña"}
      </Button>
    </form>
  );
}
