import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";

interface ReviewFormProps {
  rating: number;
  comment: string;
  wantsSupportContact?: boolean;
  whatHappened?: string;
  onRatingChange: (value: number) => void;
  onCommentChange: (value: string) => void;
  onWantsSupportContactChange?: (value: boolean) => void;
  onWhatHappenedChange?: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

export function ReviewForm({
  rating,
  comment,
  wantsSupportContact = false,
  whatHappened = "",
  onRatingChange,
  onCommentChange,
  onWantsSupportContactChange,
  onWhatHappenedChange,
  onSubmit,
  onCancel,
  loading = false,
  error,
}: ReviewFormProps) {
  const isLowRating = rating >= 1 && rating <= 2;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Calificación <span className="text-danger">*</span>
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

      {isLowRating && onWantsSupportContactChange && (
        <>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="wantsSupportContact"
              checked={wantsSupportContact}
              onChange={(e) => onWantsSupportContactChange(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label
              htmlFor="wantsSupportContact"
              className="text-sm text-text cursor-pointer"
            >
              Quiero que soporte me contacte
            </label>
          </div>

          {onWhatHappenedChange && (
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                ¿Qué pasó? (opcional)
              </label>
              <textarea
                value={whatHappened}
                onChange={(e) => onWhatHappenedChange(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Contanos qué pasó para poder ayudarte mejor..."
              />
            </div>
          )}
        </>
      )}

      {error && (
        <Text variant="small" className="text-danger">
          {error}
        </Text>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            Ahora no
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className={onCancel ? "flex-1" : "w-full"}
          disabled={loading || rating === 0}
        >
          {loading ? "Enviando reseña..." : "Enviar reseña"}
        </Button>
      </div>
    </form>
  );
}
