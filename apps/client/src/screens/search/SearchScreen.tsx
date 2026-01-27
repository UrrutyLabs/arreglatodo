"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/presentational/Navigation";
import { SearchHero } from "@/components/search/SearchHero";
import { CategoryCarousel } from "@/components/search/CategoryCarousel";
import { SubcategoryGrid } from "@/components/search/SubcategoryGrid";
import { Category, type Subcategory } from "@repo/domain";

/**
 * SearchScreen Component
 *
 * Main search page that displays:
 * - Centered search bar
 * - Horizontal category carousel
 * - Subcategory grid (shown when category is selected)
 *
 * Handles navigation to search results page when:
 * - User submits search query
 * - User clicks on a subcategory
 *
 * @example
 * ```tsx
 * <SearchScreen />
 * ```
 */
export function SearchScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    Category.PLUMBING
  );

  const handleCategoryClick = useCallback((category: Category) => {
    setSelectedCategory(category);
    // Scroll to subcategories if on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const element = document.getElementById("subcategories");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  const handleSubcategoryClick = useCallback(
    (subcategory: Subcategory) => {
      // Navigate to results page with category and subcategory
      const params = new URLSearchParams();
      params.set("category", subcategory.category);
      params.set("subcategory", subcategory.slug);
      router.push(`/search/results?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-bg">
      <Navigation showLogin={true} showProfile={true} />
      <div className="px-4 py-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search Hero - Centered */}
          <div className="flex justify-center mb-8 md:mb-12">
            <SearchHero />
          </div>

          {/* Category Carousel - Centered horizontal list */}
          <div className="mb-8 md:mb-12">
            <CategoryCarousel
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>

          {/* Subcategory Grid - Shows when category is selected */}
          {selectedCategory && (
            <div id="subcategories" className="mt-8 md:mt-12">
              <SubcategoryGrid
                category={selectedCategory}
                onSubcategoryClick={handleSubcategoryClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
