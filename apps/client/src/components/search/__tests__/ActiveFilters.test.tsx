import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ActiveFilters } from "../ActiveFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@repo/domain";

vi.mock("next/navigation");

const mockPush = vi.fn();
const mockGet = vi.fn();
const mockToString = vi.fn();
const mockDelete = vi.fn();

describe("ActiveFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      get: mockGet,
      toString: mockToString,
      delete: mockDelete,
    });
    mockToString.mockReturnValue("");
  });

  describe("rendering", () => {
    it("should not render when no filters are active", () => {
      mockGet.mockReturnValue(null);
      const { container } = render(<ActiveFilters onFilterRemove={vi.fn()} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render search query filter", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "q") return "plumber";
        return null;
      });
      render(<ActiveFilters onFilterRemove={vi.fn()} />);
      expect(screen.getByText('"plumber"')).toBeInTheDocument();
    });

    it("should render category filter", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "category") return Category.PLUMBING;
        return null;
      });
      render(<ActiveFilters onFilterRemove={vi.fn()} />);
      expect(screen.getByText("Plomería")).toBeInTheDocument();
    });

    it("should render subcategory filter", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "category") return Category.PLUMBING;
        if (key === "subcategory") return "fugas-goteras";
        return null;
      });
      render(<ActiveFilters onFilterRemove={vi.fn()} />);
      expect(screen.getByText("Fugas y goteras")).toBeInTheDocument();
    });

    it("should render all active filters", () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "q") return "plumber";
        if (key === "category") return Category.PLUMBING;
        if (key === "subcategory") return "fugas-goteras";
        return null;
      });
      render(<ActiveFilters onFilterRemove={vi.fn()} />);
      expect(screen.getByText('"plumber"')).toBeInTheDocument();
      expect(screen.getByText("Plomería")).toBeInTheDocument();
      expect(screen.getByText("Fugas y goteras")).toBeInTheDocument();
    });
  });

  describe("filter removal", () => {
    it("should remove search query filter", async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "q") return "plumber";
        return null;
      });
      mockToString.mockReturnValue("q=plumber");
      render(<ActiveFilters onFilterRemove={vi.fn()} />);

      const removeButton = screen.getByLabelText('Remover búsqueda "plumber"');
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/search/results");
      });
    });

    it("should remove category filter and subcategory", async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "category") return Category.PLUMBING;
        if (key === "subcategory") return "fugas-goteras";
        return null;
      });
      mockToString.mockReturnValue(
        "category=PLUMBING&subcategory=fugas-goteras"
      );
      render(<ActiveFilters onFilterRemove={vi.fn()} />);

      const removeButton = screen.getByLabelText("Remover categoría Plomería");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith("category");
        expect(mockDelete).toHaveBeenCalledWith("subcategory");
      });
    });

    it("should remove only subcategory filter", async () => {
      mockGet.mockImplementation((key: string) => {
        if (key === "category") return Category.PLUMBING;
        if (key === "subcategory") return "fugas-goteras";
        return null;
      });
      mockToString.mockReturnValue(
        "category=PLUMBING&subcategory=fugas-goteras"
      );
      render(<ActiveFilters onFilterRemove={vi.fn()} />);

      const removeButton = screen.getByLabelText(
        "Remover subcategoría Fugas y goteras"
      );
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith("subcategory");
      });
    });
  });
});
