import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AuthService } from "../auth.service";
import type { UserRepository } from "@modules/user/user.repo";
import type { ClientProfileService } from "@modules/user/clientProfile.service";
import { Role } from "@repo/domain";

// Mock Supabase
type MockSupabaseClient = {
  auth: {
    admin: {
      createUser: ReturnType<typeof vi.fn>;
      deleteUser: ReturnType<typeof vi.fn>;
    };
  };
};

vi.mock("@supabase/supabase-js", () => {
  const mockSupabaseClient: MockSupabaseClient = {
    auth: {
      admin: {
        createUser: vi.fn(),
        deleteUser: vi.fn(),
      },
    },
  };

  return {
    createClient: vi.fn((): MockSupabaseClient => mockSupabaseClient) as () => MockSupabaseClient,
  };
});

// Import after mock to get the mocked version
import { createClient } from "@supabase/supabase-js";

describe("AuthService", () => {
  let service: AuthService;
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockClientProfileService: ReturnType<typeof createMockClientProfileService>;
  let mockSupabaseClient: MockSupabaseClient;

  function createMockUserRepository(): {
    create: ReturnType<typeof vi.fn>;
  } {
    return {
      create: vi.fn(),
    };
  }

  function createMockClientProfileService(): {
    updateProfile: ReturnType<typeof vi.fn>;
  } {
    return {
      updateProfile: vi.fn(),
    };
  }

  beforeEach(() => {
    // Set up environment variables
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    mockUserRepository = createMockUserRepository();
    mockClientProfileService = createMockClientProfileService();

    // Get mocked Supabase client
    mockSupabaseClient = createClient("", "") as unknown as MockSupabaseClient;

    service = new AuthService(
      mockUserRepository as unknown as UserRepository,
      mockClientProfileService as unknown as ClientProfileService
    );

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("signupClient", () => {
    it("should create client user in Supabase, DB, and profile", async () => {
      // Arrange
      const input = {
        email: "client@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        phone: "+1234567890",
      };
      const supabaseUserId = "supabase-user-1";
      const dbUser = { id: supabaseUserId, role: Role.CLIENT, createdAt: new Date() };

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: supabaseUserId } },
        error: null,
      });
      mockUserRepository.create.mockResolvedValue(dbUser);
      mockClientProfileService.updateProfile.mockResolvedValue({
        id: "profile-1",
        userId: supabaseUserId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        preferredContactMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await service.signupClient(input);

      // Assert
      expect(mockSupabaseClient.auth.admin.createUser).toHaveBeenCalledWith({
        email: input.email,
        password: input.password,
        email_confirm: false,
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith(Role.CLIENT, supabaseUserId);
      expect(mockClientProfileService.updateProfile).toHaveBeenCalledWith(supabaseUserId, {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      });
      expect(result).toEqual({
        userId: supabaseUserId,
        email: input.email,
      });
    });

    it("should rollback Supabase user if DB creation fails", async () => {
      // Arrange
      const input = {
        email: "client@example.com",
        password: "password123",
      };
      const supabaseUserId = "supabase-user-1";
      const dbError = new Error("Database error");

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: supabaseUserId } },
        error: null,
      });
      mockUserRepository.create.mockRejectedValue(dbError);
      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({ data: {}, error: null });

      // Act & Assert
      await expect(service.signupClient(input)).rejects.toThrow("Database error");

      // Should attempt to delete Supabase user
      expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith(supabaseUserId);
    });

    it("should throw error when Supabase user creation fails", async () => {
      // Arrange
      const input = {
        email: "client@example.com",
        password: "password123",
      };
      const supabaseError = { message: "Email already exists" };

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { user: null },
        error: supabaseError,
      });

      // Act & Assert
      await expect(service.signupClient(input)).rejects.toThrow("Email already exists");
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it("should handle optional fields in client signup", async () => {
      // Arrange
      const input = {
        email: "client@example.com",
        password: "password123",
        // No firstName, lastName, phone
      };
      const supabaseUserId = "supabase-user-1";
      const dbUser = { id: supabaseUserId, role: Role.CLIENT, createdAt: new Date() };

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: supabaseUserId } },
        error: null,
      });
      mockUserRepository.create.mockResolvedValue(dbUser);
      mockClientProfileService.updateProfile.mockResolvedValue({
        id: "profile-1",
        userId: supabaseUserId,
        email: input.email,
        firstName: null,
        lastName: null,
        phone: null,
        preferredContactMethod: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await service.signupClient(input);

      // Assert
      expect(mockClientProfileService.updateProfile).toHaveBeenCalledWith(supabaseUserId, {
        email: input.email,
        firstName: null,
        lastName: null,
        phone: null,
      });
      expect(result).toEqual({
        userId: supabaseUserId,
        email: input.email,
      });
    });
  });

  describe("signupPro", () => {
    it("should create pro user in Supabase and DB", async () => {
      // Arrange
      const input = {
        email: "pro@example.com",
        password: "password123",
      };
      const supabaseUserId = "supabase-pro-1";
      const dbUser = { id: supabaseUserId, role: Role.PRO, createdAt: new Date() };

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: supabaseUserId } },
        error: null,
      });
      mockUserRepository.create.mockResolvedValue(dbUser);

      // Act
      const result = await service.signupPro(input);

      // Assert
      expect(mockSupabaseClient.auth.admin.createUser).toHaveBeenCalledWith({
        email: input.email,
        password: input.password,
        email_confirm: false,
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith(Role.PRO, supabaseUserId);
      expect(mockClientProfileService.updateProfile).not.toHaveBeenCalled();
      expect(result).toEqual({
        userId: supabaseUserId,
        email: input.email,
      });
    });

    it("should rollback Supabase user if DB creation fails", async () => {
      // Arrange
      const input = {
        email: "pro@example.com",
        password: "password123",
      };
      const supabaseUserId = "supabase-pro-1";
      const dbError = new Error("Database error");

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: supabaseUserId } },
        error: null,
      });
      mockUserRepository.create.mockRejectedValue(dbError);
      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({ data: {}, error: null });

      // Act & Assert
      await expect(service.signupPro(input)).rejects.toThrow("Database error");

      // Should attempt to delete Supabase user
      expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith(supabaseUserId);
    });

    it("should not create ProProfile during signup", async () => {
      // Arrange
      const input = {
        email: "pro@example.com",
        password: "password123",
      };
      const supabaseUserId = "supabase-pro-1";
      const dbUser = { id: supabaseUserId, role: Role.PRO, createdAt: new Date() };

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: supabaseUserId } },
        error: null,
      });
      mockUserRepository.create.mockResolvedValue(dbUser);

      // Act
      await service.signupPro(input);

      // Assert - ProProfile should NOT be created (that happens in onboarding)
      expect(mockClientProfileService.updateProfile).not.toHaveBeenCalled();
    });
  });
});
