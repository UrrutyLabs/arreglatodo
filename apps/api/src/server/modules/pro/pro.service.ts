import { injectable, inject } from "tsyringe";
import {
  type ProRepository,
  type ProProfileEntity,
  type ProProfileCreateInput,
} from "./pro.repo";
import type { ReviewRepository } from "@modules/review/review.repo";
import type { UserRepository } from "@modules/user/user.repo";
import type {
  Pro,
  ProOnboardInput,
  ProSetAvailabilityInput,
  Category,
} from "@repo/domain";
import { Role } from "@repo/domain";
import { TOKENS } from "@/server/container/tokens";

/**
 * Pro service
 * Contains business logic for pro operations
 * Note: Temporarily adapts between new repository entities and domain types for router compatibility
 */
@injectable()
export class ProService {
  constructor(
    @inject(TOKENS.ProRepository)
    private readonly proRepository: ProRepository,
    @inject(TOKENS.ReviewRepository)
    private readonly reviewRepository: ReviewRepository,
    @inject(TOKENS.UserRepository)
    private readonly userRepository: UserRepository
  ) {}
  /**
   * Onboard a new pro
   * Business rules:
   * - User must be created first
   */
  async onboardPro(input: ProOnboardInput): Promise<Pro> {
    // Create user first
    const user = await this.userRepository.create(Role.PRO);

    // Create pro profile
    const proProfile = await this.proRepository.create({
      userId: user.id,
      displayName: input.name,
      email: input.email,
      phone: input.phone,
      bio: undefined,
      hourlyRate: input.hourlyRate,
      categories: input.categories.map((c) => c as string),
      serviceArea: input.serviceArea,
    });

    // Map to domain type
    return this.mapToDomain(proProfile);
  }

  /**
   * Convert an existing user to PRO role and create their pro profile
   * Used when a user signs up via pro_mobile app
   * 
   * Note: With user metadata approach, users from pro_mobile are created with PRO role
   * in the context. This method serves as a safety check and ensures pro profile is created.
   * 
   * Business rules:
   * - User must exist (created by context on first API call)
   * - User must not already have a pro profile
   * - User role will be updated to PRO if not already PRO (safety check)
   */
  async convertUserToPro(
    userId: string,
    input: ProOnboardInput
  ): Promise<Pro> {
    // Check if user already has a pro profile
    const existingPro = await this.proRepository.findByUserId(userId);
    if (existingPro) {
      // If pro profile exists, return it
      return this.mapToDomain(existingPro);
    }

    // Get user to check current role
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user role to PRO if not already PRO
    if (user.role !== Role.PRO) {
      await this.userRepository.updateRole(userId, Role.PRO);
    }

    // Create pro profile
    const proProfile = await this.proRepository.create({
      userId,
      displayName: input.name,
      email: input.email,
      phone: input.phone,
      bio: undefined,
      hourlyRate: input.hourlyRate,
      categories: input.categories.map((c) => c as string),
      serviceArea: input.serviceArea,
    });

    // Map to domain type
    return this.mapToDomain(proProfile);
  }

  /**
   * Get pro by ID
   */
  async getProById(id: string): Promise<Pro | null> {
    const proProfile = await this.proRepository.findById(id);
    if (!proProfile) return null;
    return this.mapToDomain(proProfile);
  }

  /**
   * Get all pros
   */
  async getAllPros(): Promise<Pro[]> {
    const proProfiles = await this.proRepository.findAll();
    return Promise.all(proProfiles.map((profile) => this.mapToDomain(profile)));
  }

  /**
   * Get pro by user ID (for authenticated pro)
   */
  async getProByUserId(userId: string): Promise<Pro | null> {
    const proProfile = await this.proRepository.findByUserId(userId);
    if (!proProfile) return null;
    return this.mapToDomain(proProfile);
  }

  /**
   * Set pro availability
   * Business rules:
   * - Pro must exist
   */
  async setAvailability(
    proId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Parameter required by API contract, implementation pending
    input: ProSetAvailabilityInput
  ): Promise<Pro> {
    const pro = await this.proRepository.findById(proId);
    if (!pro) {
      throw new Error("Pro not found");
    }

    // Update pro profile if needed (for now, just return existing)
    const updated = pro;

    if (!updated) {
      throw new Error("Failed to update pro");
    }

    return this.mapToDomain(updated);
  }

  /**
   * Update pro profile
   * Business rules:
   * - Pro must exist
   * - Only update provided fields
   */
  async updateProfile(
    userId: string,
    input: Partial<ProOnboardInput>
  ): Promise<Pro> {
    const proProfile = await this.proRepository.findByUserId(userId);
    if (!proProfile) {
      throw new Error("Pro profile not found");
    }

    // Map ProOnboardInput fields to ProProfileCreateInput fields
    const updateData: Partial<ProProfileCreateInput> = {};
    
    if (input.name !== undefined) {
      updateData.displayName = input.name;
    }
    if (input.email !== undefined) {
      updateData.email = input.email;
    }
    if (input.phone !== undefined) {
      updateData.phone = input.phone;
    }
    if (input.hourlyRate !== undefined) {
      updateData.hourlyRate = input.hourlyRate;
    }
    if (input.categories !== undefined) {
      updateData.categories = input.categories.map((c) => c as string);
    }
    if (input.serviceArea !== undefined) {
      updateData.serviceArea = input.serviceArea;
    }

    // Update pro profile
    const updated = await this.proRepository.update(proProfile.id, updateData);
    
    if (!updated) {
      throw new Error("Failed to update pro profile");
    }

    return this.mapToDomain(updated);
  }

  /**
   * Map ProProfileEntity to Pro domain type
   * Calculates rating and reviewCount from reviews
   */
  private async mapToDomain(entity: ProProfileEntity): Promise<Pro> {
    // Get reviews for this pro to calculate rating and reviewCount
    const reviews = await this.reviewRepository.findByProProfileId(entity.id);

    // Calculate average rating
    const rating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : undefined;

    // Get review count
    const reviewCount = reviews.length;

    // Map status enum to boolean flags
    const isApproved = entity.status === "active";
    const isSuspended = entity.status === "suspended";

    // Map categories from string[] to Category[]
    const categories = entity.categories.map(
      (c) => c as Category
    ) as Category[];

    return {
      id: entity.id,
      name: entity.displayName,
      email: entity.email,
      phone: entity.phone ?? undefined,
      hourlyRate: entity.hourlyRate,
      categories,
      serviceArea: entity.serviceArea ?? undefined,
      rating,
      reviewCount,
      isApproved,
      isSuspended,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

