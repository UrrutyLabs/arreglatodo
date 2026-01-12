/**
 * Currency formatting utilities
 * Universal (works in browser and React Native via Intl API)
 */

/**
 * Format a currency amount
 * @param amount - Amount to format (in major units if isMinorUnits is false, minor units if true)
 * @param currency - Currency code (default: "UYU")
 * @param isMinorUnits - Whether amount is in minor units (cents). If true, divides by 100
 * @returns Formatted currency string (e.g., "$1.000" for UYU)
 */
export function formatCurrency(
  amount: number,
  currency: string = "UYU",
  isMinorUnits: boolean = false
): string {
  const amountInMajorUnits = isMinorUnits ? amount / 100 : amount;
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amountInMajorUnits);
}
