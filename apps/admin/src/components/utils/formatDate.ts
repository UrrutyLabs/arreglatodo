/**
 * Format date for display in admin UI
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-UY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format date for table display (shorter format)
 */
export function formatDateShort(date: Date): string {
  return new Date(date).toLocaleDateString("es-UY", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
