import { proRepository, type ProProfileEntity } from "../repositories/pro.repo";
import { reviewRepository } from "../repositories/review.repo";
import { userRepository } from "../repositories/user.repo";
import type {
  Pro,
  ProOnboardInput,
  ProSetAvailabilityInput,
  Category,
} from "@repo/domain";
import { Role } from "@repo/domain";

/**
 * Pro service
 * Contains business logic for pro operations
 * Note: Temporarily adapts between new repository entities and domain types for router compatibility
 */
export class ProService {
  /**
   * Onboard a new pro
   * Business rules:
   * - User must be created first
   */
  async onboardPro(input: ProOnboardInput): Promise<Pro> {
    // Create user first
    const user = await userRepository.create(Role.PRO);

    // Create pro profile
    const proProfile = await proRepository.create({
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
   * Get pro by ID
   */
  async getProById(id: string): Promise<Pro | null> {
    const proProfile = await proRepository.findById(id);
    if (!proProfile) return null;
    return this.mapToDomain(proProfile);
  }

  /**
   * Get all pros
   */
  async getAllPros(): Promise<Pro[]> {
    const proProfiles = await proRepository.findAll();
    return Promise.all(proProfiles.map((profile) => this.mapToDomain(profile)));
  }

  /**
   * Set pro availability
   * Business rules:
   * - Pro must exist
   */
  async setAvailability(
    proId: string,
    input: ProSetAvailabilityInput
  ): Promise<Pro> {
    const pro = await proRepository.findById(proId);
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
   * Map ProProfileEntity to Pro domain type
   * Calculates rating and reviewCount from reviews
   */
  private async mapToDomain(entity: ProProfileEntity): Promise<Pro> {
    // Get reviews for this pro to calculate rating and reviewCount
    const reviews = await reviewRepository.findByProProfileId(entity.id);

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

export const proService = new ProService();
