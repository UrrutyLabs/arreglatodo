import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTodayDate } from "../useTodayDate";

describe("useTodayDate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return today's date in YYYY-MM-DD format", () => {
    // Set a specific date: January 15, 2024
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T10:30:00Z"));

    const { result } = renderHook(() => useTodayDate());

    expect(result.current).toBe("2024-01-15");
  });

  it("should pad single-digit months and days with zeros", () => {
    // Set date: January 5, 2024
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-05T10:30:00Z"));

    const { result } = renderHook(() => useTodayDate());

    expect(result.current).toBe("2024-01-05");
  });

  it("should handle month correctly (getMonth() returns 0-11)", () => {
    // Set date: December 25, 2024 (month 11 in JS)
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-12-25T10:30:00Z"));

    const { result } = renderHook(() => useTodayDate());

    expect(result.current).toBe("2024-12-25");
  });

  it("should return consistent value on multiple renders", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-20T10:30:00Z"));

    const { result, rerender } = renderHook(() => useTodayDate());

    const firstValue = result.current;
    rerender();
    const secondValue = result.current;

    expect(firstValue).toBe("2024-06-20");
    expect(secondValue).toBe(firstValue);
  });

  it("should handle year transitions correctly", () => {
    // Set date: January 1, 2025 (using local time to avoid timezone issues)
    vi.useFakeTimers();
    const jan1_2025 = new Date(2025, 0, 1, 12, 0, 0); // Month 0 = January
    vi.setSystemTime(jan1_2025);

    const { result } = renderHook(() => useTodayDate());

    expect(result.current).toBe("2025-01-01");
  });

  it("should handle leap year dates correctly", () => {
    // Set date: February 29, 2024 (leap year)
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-02-29T10:30:00Z"));

    const { result } = renderHook(() => useTodayDate());

    expect(result.current).toBe("2024-02-29");
  });
});
