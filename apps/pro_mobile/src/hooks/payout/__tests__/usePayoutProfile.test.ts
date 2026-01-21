import { renderHook } from "@testing-library/react-native";
import { trpc } from "@lib/trpc/client";
import { usePayoutProfile } from "../usePayoutProfile";

jest.mock("@lib/trpc/client");

const mockUseQuery = jest.fn();

describe("usePayoutProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (trpc as any).proPayout = {
      getMine: {
        useQuery: mockUseQuery,
      },
    };
  });

  it("should return payout profile data when query succeeds", () => {
    const mockProfile = {
      id: "profile-1",
      proProfileId: "pro-1",
      payoutMethod: "BANK_TRANSFER" as const,
      fullName: "John Doe",
      documentId: "12345678",
      bankName: "Test Bank",
      bankAccountType: "CHECKING" as const,
      bankAccountNumber: "1234567890",
      currency: "USD",
      isComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUseQuery.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePayoutProfile());

    expect(result.current.data).toEqual(mockProfile);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should return null when profile does not exist", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => usePayoutProfile());

    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return loading state when query is loading", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => usePayoutProfile());

    expect(result.current.isLoading).toBe(true);
  });

  it("should return error when query fails", () => {
    const mockError = { message: "Failed to fetch payout profile" };
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => usePayoutProfile());

    expect(result.current.error).toBe(mockError);
  });

  it("should call query with undefined input", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayoutProfile());

    expect(mockUseQuery).toHaveBeenCalledWith(undefined, expect.any(Object));
  });

  it("should configure retry to false", () => {
    mockUseQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderHook(() => usePayoutProfile());

    expect(mockUseQuery).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({
        retry: false,
      })
    );
  });
});
