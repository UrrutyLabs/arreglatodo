import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchScreen } from "../SearchScreen";
import { useRouter } from "next/navigation";
import { Category } from "@repo/domain";

vi.mock("next/navigation");
vi.mock("@/components/presentational/Navigation", () => ({
  Navigation: () => <nav>Navigation</nav>,
}));

const mockPush = vi.fn();

describe("SearchScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    // Mock window.innerWidth for mobile scroll test
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    global.scrollIntoView = vi.fn();
  });

  describe("rendering", () => {
    it("should render search hero", () => {
      render(<SearchScreen />);
      expect(
        screen.getByPlaceholderText("¿Qué necesitás?")
      ).toBeInTheDocument();
    });

    it("should render category carousel", () => {
      render(<SearchScreen />);
      // Category carousel should be rendered (checking for a category)
      expect(screen.getByText("Plomería")).toBeInTheDocument();
    });

    it("should not show subcategories initially", () => {
      render(<SearchScreen />);
      // Subcategory grid should not be visible until category is selected
      const subcategoriesSection = document.getElementById("subcategories");
      expect(subcategoriesSection).not.toBeInTheDocument();
    });
  });

  describe("category selection", () => {
    it("should show subcategories when category is clicked", () => {
      render(<SearchScreen />);
      const plumbingCategory = screen.getByText("Plomería").closest("button");

      if (plumbingCategory) {
        fireEvent.click(plumbingCategory);
      }

      waitFor(() => {
        const subcategoriesSection = document.getElementById("subcategories");
        expect(subcategoriesSection).toBeInTheDocument();
      });
    });

    it("should scroll to subcategories on mobile when category is clicked", async () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500, // Mobile width
      });

      render(<SearchScreen />);
      const plumbingCategory = screen.getByText("Plomería").closest("button");

      if (plumbingCategory) {
        fireEvent.click(plumbingCategory);
      }

      await waitFor(
        () => {
          expect(global.scrollIntoView).toHaveBeenCalled();
        },
        { timeout: 200 }
      );
    });
  });

  describe("subcategory navigation", () => {
    it("should navigate to results page when subcategory is clicked", async () => {
      render(<SearchScreen />);

      // First select a category
      const plumbingCategory = screen.getByText("Plomería").closest("button");
      if (plumbingCategory) {
        fireEvent.click(plumbingCategory);
      }

      await waitFor(() => {
        const subcategoriesSection = document.getElementById("subcategories");
        expect(subcategoriesSection).toBeInTheDocument();
      });

      // Then click a subcategory
      const subcategoryCard = screen
        .getByText("Fugas y goteras")
        .closest("div");
      if (subcategoryCard) {
        fireEvent.click(subcategoryCard);
      }

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("/search/results")
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("category=PLUMBING")
        );
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining("subcategory=fugas-goteras")
        );
      });
    });
  });
});
