import { trpc } from "@/lib/trpc/client";
import { Category } from "@repo/domain";

/**
 * Hook to fetch subcategories by category
 */
export function useSubcategories(category?: Category) {
  const {
    data: subcategories,
    isLoading,
    error,
  } = trpc.subcategory.getByCategory.useQuery(
    { category: category! },
    {
      enabled: !!category,
      refetchOnWindowFocus: false,
    }
  );

  return {
    subcategories: subcategories ?? [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch all subcategories
 */
export function useAllSubcategories() {
  const {
    data: subcategories,
    isLoading,
    error,
  } = trpc.subcategory.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return {
    subcategories: subcategories ?? [],
    isLoading,
    error,
  };
}

/**
 * Hook to fetch a single subcategory by ID
 */
export function useSubcategoryById(id?: string) {
  const {
    data: subcategory,
    isLoading,
    error,
  } = trpc.subcategory.getById.useQuery(
    { id: id! },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  return {
    subcategory: subcategory ?? null,
    isLoading,
    error,
  };
}

/**
 * Hook to fetch a single subcategory by slug and category
 */
export function useSubcategoryBySlug(slug?: string, category?: Category) {
  const {
    data: subcategory,
    isLoading,
    error,
  } = trpc.subcategory.getBySlug.useQuery(
    { slug: slug!, category: category! },
    {
      enabled: !!slug && !!category,
      refetchOnWindowFocus: false,
    }
  );

  return {
    subcategory: subcategory ?? null,
    isLoading,
    error,
  };
}
