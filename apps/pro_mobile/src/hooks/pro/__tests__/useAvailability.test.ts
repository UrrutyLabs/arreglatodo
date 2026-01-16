import { renderHook } from "@testing-library/react-native";
import { trpc } from "@lib/trpc/client";
import { useAvailability } from "../useAvailability";

jest.mock("@lib/trpc/client");

const mockUseQuery = jest.fn();

describe("useAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup tRPC mocks structure
    (trpc as any).pro = {
      getMyProfile: {
        useQuery: mockUseQuery,
      },
    };
  });

  describe("initial state", () => {
    it("should return isAvailable false when pro is not loaded", () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      const { result } = renderHook(() => useAvailability());

      expect(result.current.isAvailable).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });

    it("should return isAvailable true when pro has availability", () => {
      mockUseQuery.mockReturnValue({
        data: {
          id: "pro-1",
          isAvailable: true,
        },
        isLoading: false,
      });

      const { result } = renderHook(() => useAvailability());

      expect(result.current.isAvailable).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it("should return isAvailable false when pro has no availability", () => {
      mockUseQuery.mockReturnValue({
        data: {
          id: "pro-1",
          isAvailable: false,
        },
        isLoading: false,
      });

      const { result } = renderHook(() => useAvailability());

      expect(result.current.isAvailable).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it("should return isAvailable false when pro data is null", () => {
      mockUseQuery.mockReturnValue({
        data: null,
        isLoading: false,
      });

      const { result } = renderHook(() => useAvailability());

      expect(result.current.isAvailable).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
