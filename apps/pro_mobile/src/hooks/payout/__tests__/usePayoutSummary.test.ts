import { renderHook } from "@testing-library/react-native";
import { trpc } from "@lib/trpc/client";
import { usePayoutSummary } from "../usePayoutSummary";

jest.mock("@lib/trpc/client");

const mockUseQuery = jest.fn();

describe("usePayoutSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (trpc as any).proPayout = {
      getSummary: {
        useQuery: mockUseQuery,
      },
    };
  });

  it("should return payout summary data when query succeeds", () => {
    const mockSummary = {
      available: 500,
      pending: 200,
      totalPaid: 1000,
    };

    mockUseQuery.mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePayoutSummary());

    expect(result.current.data).toEqual(mockSummary);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should return summary with zero values when no payouts exist", () => {
    const mockSummary = {
      available: 0,
      pending: 0,
      totalPaid: 0,
    };

    mockUseQuery.mockReturnValue({
      data: mockSummary,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePayoutSummary());

    expect(result.current.data).toEqual(mockSummary);
  });

  it("should return loading state when query is loading", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => usePayoutSummary());

    expect(result.current.isLoading).toBe(true);
  });

  it("should return error when query fails", () => {
    const mockError = { message: "Failed to fetch payout summary" };
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => usePayoutSummary());

    expect(result.current.error).toBe(mockError);
  });

  it("should call query with undefined input", () => {
    mockUseQuery.mockReturnValue({
      data: { available: 0, pending: 0, totalPaid: 0 },
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayoutSummary());

    expect(mockUseQuery).toHaveBeenCalledWith(undefined, expect.any(Object));
  });

  it("should configure retry to false", () => {
    mockUseQuery.mockReturnValue({
      data: { available: 0, pending: 0, totalPaid: 0 },
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayoutSummary());

    expect(mockUseQuery).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        retry: false,
      })
    );
  });
});
