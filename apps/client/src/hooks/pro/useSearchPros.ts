import { trpc } from "@/lib/trpc/client";
import { Category, type TimeWindow } from "@repo/domain";

interface SearchFilters {
  category?: Category;
  subcategory?: string; // For future API support, currently not used
  date?: string;
  timeWindow?: TimeWindow;
  searchQuery?: string; // For future API support, currently not used
}

export function useSearchPros(filters: SearchFilters) {
  const {
    data: pros,
    isLoading,
    error,
  } = trpc.client.searchPros.useQuery(
    {
      category: filters.category,
      subcategory: filters.subcategory,
      date: filters.date ? new Date(filters.date) : undefined,
      timeWindow: filters.timeWindow,
      // Note: searchQuery is not yet supported by API
      // It's included in the interface for future use
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    pros: pros ?? [],
    isLoading,
    error,
  };
}
