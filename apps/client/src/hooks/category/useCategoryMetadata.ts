import { trpc } from "@/lib/trpc/client";
import { Category } from "@repo/domain";

/**
 * Hook to fetch category metadata
 */
export function useCategoryMetadata(category?: Category) {
  const {
    data: metadata,
    isLoading,
    error,
  } = trpc.category.getMetadata.useQuery(
    { category: category! },
    {
      enabled: !!category,
      refetchOnWindowFocus: false,
    }
  );

  return {
    metadata: metadata ?? null,
    isLoading,
    error,
  };
}

/**
 * Hook to fetch all categories metadata
 */
export function useAllCategoriesMetadata() {
  const {
    data: metadataList,
    isLoading,
    error,
  } = trpc.category.getAllMetadata.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return {
    metadataList: metadataList ?? [],
    isLoading,
    error,
  };
}
