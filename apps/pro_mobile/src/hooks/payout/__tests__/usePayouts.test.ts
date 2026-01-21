import { renderHook } from "@testing-library/react-native";
import { trpc } from "@lib/trpc/client";
import { usePayouts } from "../usePayouts";

jest.mock("@lib/trpc/client");

const mockUseQuery = jest.fn();

describe("usePayouts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (trpc as any).proPayout = {
      getMinePayouts: {
        useQuery: mockUseQuery,
      },
    };
  });

  it("should return payouts array when query succeeds", () => {
    const mockPayouts = [
      {
        id: "payout-1",
        proProfileId: "pro-1",
        amount: 500,
        status: "COMPLETED" as const,
        completedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: "payout-2",
        proProfileId: "pro-1",
        amount: 300,
        status: "PENDING" as const,
        createdAt: new Date(),
      },
    ];

    mockUseQuery.mockReturnValue({
      data: mockPayouts,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePayouts());

    expect(result.current.data).toEqual(mockPayouts);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should pass limit and offset to query", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayouts({ limit: 10, offset: 20 }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      { limit: 10, offset: 20 },
      expect.objectContaining({ retry: false })
    );
  });

  it("should pass only limit to query", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayouts({ limit: 5 }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      { limit: 5, offset: undefined },
      expect.objectContaining({ retry: false })
    );
  });

  it("should pass only offset to query", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayouts({ offset: 10 }));

    expect(mockUseQuery).toHaveBeenCalledWith(
      { limit: undefined, offset: 10 },
      expect.objectContaining({ retry: false })
    );
  });

  it("should call query with undefined when no options provided", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayouts());

    expect(mockUseQuery).toHaveBeenCalledWith(
      { limit: undefined, offset: undefined },
      expect.objectContaining({ retry: false })
    );
  });

  it("should return loading state when query is loading", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => usePayouts());

    expect(result.current.isLoading).toBe(true);
  });

  it("should return error when query fails", () => {
    const mockError = { message: "Failed to fetch payouts" };
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => usePayouts());

    expect(result.current.error).toBe(mockError);
  });

  it("should configure retry to false", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayouts());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        retry: false,
      })
    );
  });
});
