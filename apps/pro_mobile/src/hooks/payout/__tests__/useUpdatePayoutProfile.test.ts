import { renderHook, act } from "@testing-library/react-native";
import { trpc } from "@lib/trpc/client";
import { useQueryClient } from "../../shared/useQueryClient";
import { useUpdatePayoutProfile } from "../useUpdatePayoutProfile";

jest.mock("@lib/trpc/client");
jest.mock("../../shared/useQueryClient");

const mockUseMutation = jest.fn();
const mockQueryClient = {
  invalidateQueries: jest.fn(),
};

describe("useUpdatePayoutProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    (trpc as any).proPayout = {
      updateMine: {
        useMutation: mockUseMutation,
      },
    };
  });

  it("should return mutation object", () => {
    const mockMutateAsync = jest.fn();
    const mockMutate = jest.fn();
    mockUseMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      mutate: mockMutate,
      isPending: false,
      error: null,
    });

    const { result } = renderHook(() => useUpdatePayoutProfile());

    expect(result.current.mutateAsync).toBe(mockMutateAsync);
    expect(result.current.mutate).toBe(mockMutate);
    expect(result.current.isPending).toBe(false);
  });

  it("should invalidate queries on success", async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(undefined);
    mockUseMutation.mockImplementation((options) => {
      // Simulate success callback
      setTimeout(() => {
        options.onSuccess?.();
      }, 0);
      return {
        mutateAsync: mockMutateAsync,
        mutate: jest.fn(),
        isPending: false,
        error: null,
      };
    });

    renderHook(() => useUpdatePayoutProfile());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [["proPayout", "getMine"]],
    });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [["proPayout", "getSummary"]],
    });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [["pro", "getMyProfile"]],
    });
  });

  it("should invalidate all required queries after successful mutation", async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({});
    let onSuccessCallback: (() => void) | undefined;
    mockUseMutation.mockImplementation((options) => {
      onSuccessCallback = options.onSuccess;
      return {
        mutateAsync: mockMutateAsync,
        mutate: jest.fn(),
        isPending: false,
        error: null,
      };
    });

    const { result } = renderHook(() => useUpdatePayoutProfile());

    await act(async () => {
      await result.current.mutateAsync({
        fullName: "John Doe",
        bankAccountNumber: "1234567890",
      });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    });

    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(3);
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [["proPayout", "getMine"]],
    });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [["proPayout", "getSummary"]],
    });
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [["pro", "getMyProfile"]],
    });
  });

  it("should return pending state when mutation is in progress", () => {
    mockUseMutation.mockReturnValue({
      mutateAsync: jest.fn(),
      mutate: jest.fn(),
      isPending: true,
      error: null,
    });

    const { result } = renderHook(() => useUpdatePayoutProfile());

    expect(result.current.isPending).toBe(true);
  });

  it("should return error when mutation fails", () => {
    const mockError = { message: "Failed to update payout profile" };
    mockUseMutation.mockReturnValue({
      mutateAsync: jest.fn(),
      mutate: jest.fn(),
      isPending: false,
      error: mockError,
    });

    const { result } = renderHook(() => useUpdatePayoutProfile());

    expect(result.current.error).toBe(mockError);
  });
});
