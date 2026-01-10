export const colors = {
  primary: "#1F3A5F",
  secondary: "#4A6FA5",
  accent: "#2CB1BC",
  bg: "#F7F9FC",
  surface: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  info: "#2563EB",
} as const;

export type Colors = typeof colors;
