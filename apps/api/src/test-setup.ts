import "reflect-metadata";
import { vi } from "vitest";

// Mock database connection to prevent initialization during unit tests
// Unit tests should mock repositories, not use real database connections
vi.mock("@infra/db/prisma", () => {
  return {
    prisma: {
      // Mock Prisma client methods as needed
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    },
    Prisma: {},
    $Enums: {
      PushProvider: {
        EXPO: "EXPO",
      },
      DevicePlatform: {
        IOS: "IOS",
        ANDROID: "ANDROID",
      },
      // Add other enums as needed by tests
    },
  };
});