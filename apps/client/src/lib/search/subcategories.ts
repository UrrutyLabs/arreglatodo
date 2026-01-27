import { Category } from "@repo/domain";

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  category: Category;
}

export const SUBCATEGORIES: Record<Category, Subcategory[]> = {
  [Category.PLUMBING]: [
    {
      id: "plumbing-leak",
      name: "Fugas y goteras",
      slug: "fugas-goteras",
      imageUrl: "/images/subcategories/plumbing-leak.jpg",
      category: Category.PLUMBING,
    },
    {
      id: "plumbing-installation",
      name: "Instalaciones",
      slug: "instalaciones",
      imageUrl: "/images/subcategories/plumbing-installation.jpg",
      category: Category.PLUMBING,
    },
    {
      id: "plumbing-unclog",
      name: "Destapaciones",
      slug: "destapaciones",
      imageUrl: "/images/subcategories/plumbing-unclog.jpg",
      category: Category.PLUMBING,
    },
    {
      id: "plumbing-water-heater",
      name: "Calentadores",
      slug: "calentadores",
      imageUrl: "/images/subcategories/plumbing-water-heater.jpg",
      category: Category.PLUMBING,
    },
  ],
  [Category.ELECTRICAL]: [
    {
      id: "electrical-installation",
      name: "Instalaciones eléctricas",
      slug: "instalaciones-electricas",
      imageUrl: "/images/subcategories/electrical-installation.jpg",
      category: Category.ELECTRICAL,
    },
    {
      id: "electrical-repair",
      name: "Reparaciones",
      slug: "reparaciones",
      imageUrl: "/images/subcategories/electrical-repair.jpg",
      category: Category.ELECTRICAL,
    },
    {
      id: "electrical-outlets",
      name: "Tomas y enchufes",
      slug: "tomas-enchufes",
      imageUrl: "/images/subcategories/electrical-outlets.jpg",
      category: Category.ELECTRICAL,
    },
    {
      id: "electrical-lighting",
      name: "Iluminación",
      slug: "iluminacion",
      imageUrl: "/images/subcategories/electrical-lighting.jpg",
      category: Category.ELECTRICAL,
    },
  ],
  [Category.CLEANING]: [
    {
      id: "cleaning-deep",
      name: "Limpieza profunda",
      slug: "limpieza-profunda",
      imageUrl: "/images/subcategories/cleaning-deep.jpg",
      category: Category.CLEANING,
    },
    {
      id: "cleaning-regular",
      name: "Limpieza regular",
      slug: "limpieza-regular",
      imageUrl: "/images/subcategories/cleaning-regular.jpg",
      category: Category.CLEANING,
    },
    {
      id: "cleaning-windows",
      name: "Limpieza de ventanas",
      slug: "limpieza-ventanas",
      imageUrl: "/images/subcategories/cleaning-windows.jpg",
      category: Category.CLEANING,
    },
    {
      id: "cleaning-post-construction",
      name: "Limpieza post-obra",
      slug: "limpieza-post-obra",
      imageUrl: "/images/subcategories/cleaning-post-construction.jpg",
      category: Category.CLEANING,
    },
  ],
  [Category.HANDYMAN]: [
    {
      id: "handyman-assembly",
      name: "Ensamblaje de muebles",
      slug: "ensamblaje-muebles",
      imageUrl: "/images/subcategories/handyman-assembly.jpg",
      category: Category.HANDYMAN,
    },
    {
      id: "handyman-hanging",
      name: "Colgar cuadros y estantes",
      slug: "colgar-cuadros",
      imageUrl: "/images/subcategories/handyman-hanging.jpg",
      category: Category.HANDYMAN,
    },
    {
      id: "handyman-repair",
      name: "Reparaciones generales",
      slug: "reparaciones-generales",
      imageUrl: "/images/subcategories/handyman-repair.jpg",
      category: Category.HANDYMAN,
    },
    {
      id: "handyman-installation",
      name: "Instalaciones varias",
      slug: "instalaciones-varias",
      imageUrl: "/images/subcategories/handyman-installation.jpg",
      category: Category.HANDYMAN,
    },
  ],
  [Category.PAINTING]: [
    {
      id: "painting-interior",
      name: "Pintura interior",
      slug: "pintura-interior",
      imageUrl: "/images/subcategories/painting-interior.jpg",
      category: Category.PAINTING,
    },
    {
      id: "painting-exterior",
      name: "Pintura exterior",
      slug: "pintura-exterior",
      imageUrl: "/images/subcategories/painting-exterior.jpg",
      category: Category.PAINTING,
    },
    {
      id: "painting-ceiling",
      name: "Pintura de techos",
      slug: "pintura-techos",
      imageUrl: "/images/subcategories/painting-ceiling.jpg",
      category: Category.PAINTING,
    },
    {
      id: "painting-touch-up",
      name: "Retoques",
      slug: "retoques",
      imageUrl: "/images/subcategories/painting-touch-up.jpg",
      category: Category.PAINTING,
    },
  ],
};

export function getSubcategoriesByCategory(category: Category): Subcategory[] {
  return SUBCATEGORIES[category] || [];
}

export function getSubcategoryBySlug(
  slug: string,
  category: Category
): Subcategory | undefined {
  return SUBCATEGORIES[category]?.find((sub) => sub.slug === slug);
}

export function getAllSubcategories(): Subcategory[] {
  return Object.values(SUBCATEGORIES).flat();
}
