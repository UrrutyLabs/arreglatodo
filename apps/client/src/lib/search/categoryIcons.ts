import {
  Wrench,
  Zap,
  Sparkles,
  Hammer,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { Category } from "@repo/domain";

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  [Category.PLUMBING]: Wrench,
  [Category.ELECTRICAL]: Zap,
  [Category.CLEANING]: Sparkles,
  [Category.HANDYMAN]: Hammer,
  [Category.PAINTING]: Palette,
};

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.PLUMBING]: "Plomería",
  [Category.ELECTRICAL]: "Electricidad",
  [Category.CLEANING]: "Limpieza",
  [Category.HANDYMAN]: "Arreglos generales",
  [Category.PAINTING]: "Pintura",
};

export function getCategoryIcon(category: Category): LucideIcon {
  return CATEGORY_ICONS[category];
}

export function getCategoryLabel(category: Category): string {
  return CATEGORY_LABELS[category];
}
