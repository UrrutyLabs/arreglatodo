import { injectable } from "tsyringe";
import { prisma } from "@infra/db/prisma";
import { Category } from "@repo/domain";
import { calculateProfileCompleted } from "./pro.calculations";

// Type representing what Prisma returns for ProProfile queries
// Union of all possible return types from Prisma queries
type PrismaProProfile =
  | NonNullable<Awaited<ReturnType<typeof prisma.proProfile.findUnique>>>
  | NonNullable<Awaited<ReturnType<typeof prisma.proProfile.create>>>
  | NonNullable<Awaited<ReturnType<typeof prisma.proProfile.update>>>
  | NonNullable<Awaited<ReturnType<typeof prisma.proProfile.findMany>>[0]>;

/**
 * ProProfile entity (plain object)
 */
export interface ProProfileEntity {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  hourlyRate: number;
  categories: string[]; // Category enum values
  serviceArea: string | null;
  status: "pending" | "active" | "suspended";
  profileCompleted: boolean;
  completedJobsCount: number;
  isTopPro: boolean;
  responseTimeMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ProProfile create input
 */
export interface ProProfileCreateInput {
  userId: string;
  displayName: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  hourlyRate: number;
  categories: string[]; // Category enum values
  serviceArea?: string;
}

/**
 * ProProfile update input
 * Allows updating regular fields and calculated fields (for internal use)
 */
export interface ProProfileUpdateInput {
  displayName?: string;
  email?: string;
  phone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  hourlyRate?: number;
  categories?: string[]; // Category enum values
  serviceArea?: string | null;
  profileCompleted?: boolean;
  completedJobsCount?: number;
  isTopPro?: boolean;
  responseTimeMinutes?: number | null;
}

/**
 * ProProfile repository interface
 * Handles all data access for service providers
 */
export interface ProRepository {
  create(input: ProProfileCreateInput): Promise<ProProfileEntity>;
  findById(id: string): Promise<ProProfileEntity | null>;
  findByUserId(userId: string): Promise<ProProfileEntity | null>;
  findAll(): Promise<ProProfileEntity[]>;
  findAllWithFilters(filters?: {
    query?: string;
    status?: "pending" | "active" | "suspended";
    limit?: number;
    cursor?: string;
  }): Promise<ProProfileEntity[]>;
  searchPros(filters: {
    category?: Category;
    profileCompleted?: boolean;
  }): Promise<ProProfileEntity[]>;
  updateStatus(
    id: string,
    status: "pending" | "active" | "suspended"
  ): Promise<ProProfileEntity | null>;
  update(
    id: string,
    data: ProProfileUpdateInput
  ): Promise<ProProfileEntity | null>;
}

/**
 * ProProfile repository implementation using Prisma
 */
@injectable()
export class ProRepositoryImpl implements ProRepository {
  async create(input: ProProfileCreateInput): Promise<ProProfileEntity> {
    const proProfile = await prisma.proProfile.create({
      data: {
        userId: input.userId,
        displayName: input.displayName,
        email: input.email,
        phone: input.phone ?? null,
        bio: input.bio ?? null,
        avatarUrl: input.avatarUrl ?? null,
        hourlyRate: input.hourlyRate,
        categories: input.categories as Category[], // Prisma expects Category[] enum, but we pass string[]
        serviceArea: input.serviceArea ?? null,
        status: "pending",
        // profileCompleted will be calculated based on avatarUrl and bio presence
        profileCompleted: calculateProfileCompleted(input.avatarUrl, input.bio),
      },
    });

    return this.mapPrismaToDomain(proProfile);
  }

  async findById(id: string): Promise<ProProfileEntity | null> {
    const proProfile = await prisma.proProfile.findUnique({
      where: { id },
    });

    return proProfile ? this.mapPrismaToDomain(proProfile) : null;
  }

  async findByUserId(userId: string): Promise<ProProfileEntity | null> {
    const proProfile = await prisma.proProfile.findUnique({
      where: { userId },
    });

    if (!proProfile) return null;
    return this.mapPrismaToDomain(proProfile);
  }

  async findAll(): Promise<ProProfileEntity[]> {
    // Only return pros with completed profiles for public visibility
    const proProfiles = await prisma.proProfile.findMany({
      where: {
        profileCompleted: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return proProfiles.map((p) => this.mapPrismaToDomain(p));
  }

  async findAllWithFilters(filters?: {
    query?: string;
    status?: "pending" | "active" | "suspended";
    limit?: number;
    cursor?: string;
  }): Promise<ProProfileEntity[]> {
    const where: {
      status?: "pending" | "active" | "suspended";
      OR?: Array<{
        displayName?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.query) {
      where.OR = [
        { displayName: { contains: filters.query, mode: "insensitive" } },
        { email: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    const proProfiles = await prisma.proProfile.findMany({
      where,
      take: filters?.limit,
      cursor: filters?.cursor ? { id: filters.cursor } : undefined,
      skip: filters?.cursor ? 1 : undefined,
      orderBy: { createdAt: "desc" },
    });

    return proProfiles.map((p) => this.mapPrismaToDomain(p));
  }

  async searchPros(filters: {
    category?: Category;
    profileCompleted?: boolean;
  }): Promise<ProProfileEntity[]> {
    const where: {
      status: "active"; // Only approved pros (isApproved = true, isSuspended = false)
      profileCompleted?: boolean;
      categories?: { has: Category };
    } = {
      status: "active", // Only return active (approved and not suspended) pros
    };

    // Filter by profileCompleted (defaults to true for public search)
    if (filters.profileCompleted !== undefined) {
      where.profileCompleted = filters.profileCompleted;
    } else {
      // Default to only completed profiles for public search
      where.profileCompleted = true;
    }

    // Filter by category if provided
    if (filters.category) {
      where.categories = { has: filters.category as Category };
    }

    const proProfiles = await prisma.proProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return proProfiles.map((p) => this.mapPrismaToDomain(p));
  }

  async updateStatus(
    id: string,
    status: "pending" | "active" | "suspended"
  ): Promise<ProProfileEntity | null> {
    const proProfile = await prisma.proProfile.update({
      where: { id },
      data: { status },
    });

    return this.mapPrismaToDomain(proProfile);
  }

  async update(
    id: string,
    data: ProProfileUpdateInput
  ): Promise<ProProfileEntity | null> {
    // Fetch current profile to get existing values for profileCompleted calculation
    const currentProfile = await prisma.proProfile.findUnique({
      where: { id },
      select: { avatarUrl: true, bio: true },
    });

    if (!currentProfile) {
      return null;
    }

    // Build update data object, only including provided fields
    const updateData: {
      displayName?: string;
      email?: string;
      phone?: string | null;
      bio?: string | null;
      avatarUrl?: string | null;
      hourlyRate?: number;
      categories?: Category[];
      serviceArea?: string | null;
      profileCompleted?: boolean;
      completedJobsCount?: number;
      isTopPro?: boolean;
      responseTimeMinutes?: number | null;
    } = {};

    if (data.displayName !== undefined) {
      updateData.displayName = data.displayName;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }
    if (data.phone !== undefined) {
      updateData.phone = data.phone ?? null;
    }
    if (data.bio !== undefined) {
      updateData.bio = data.bio ?? null;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl ?? null;
    }
    if (data.hourlyRate !== undefined) {
      updateData.hourlyRate = data.hourlyRate;
    }
    if (data.categories !== undefined) {
      updateData.categories = data.categories as Category[]; // Prisma expects Category[] enum
    }
    if (data.serviceArea !== undefined) {
      updateData.serviceArea = data.serviceArea ?? null;
    }
    if (data.completedJobsCount !== undefined) {
      updateData.completedJobsCount = data.completedJobsCount;
    }
    if (data.isTopPro !== undefined) {
      updateData.isTopPro = data.isTopPro;
    }
    if (data.responseTimeMinutes !== undefined) {
      updateData.responseTimeMinutes = data.responseTimeMinutes ?? null;
    }

    // Recalculate profileCompleted if avatarUrl or bio is being updated
    if (data.avatarUrl !== undefined || data.bio !== undefined) {
      const finalAvatarUrl =
        data.avatarUrl !== undefined
          ? data.avatarUrl
          : currentProfile.avatarUrl;
      const finalBio = data.bio !== undefined ? data.bio : currentProfile.bio;
      updateData.profileCompleted = calculateProfileCompleted(
        finalAvatarUrl,
        finalBio
      );
    } else if (data.profileCompleted !== undefined) {
      // Only allow manual override if avatarUrl/bio are not being updated
      updateData.profileCompleted = data.profileCompleted;
    }

    const proProfile = await prisma.proProfile.update({
      where: { id },
      data: updateData,
    });

    return this.mapPrismaToDomain(proProfile);
  }

  private mapPrismaToDomain(
    prismaProProfile: NonNullable<PrismaProProfile>
  ): ProProfileEntity {
    const p = prismaProProfile;
    // Prisma returns Category[] enum, but we need to convert to string[] for domain
    const categories = Array.isArray(p.categories)
      ? (p.categories as unknown as Category[]).map((c) => String(c))
      : [];

    return {
      id: p.id,
      userId: p.userId,
      displayName: p.displayName,
      email: p.email ?? "",
      phone: p.phone ?? null,
      bio: p.bio ?? null,
      avatarUrl: p.avatarUrl ?? null,
      hourlyRate: p.hourlyRate,
      categories,
      serviceArea: p.serviceArea ?? null,
      status: p.status as "pending" | "active" | "suspended",
      profileCompleted: p.profileCompleted,
      completedJobsCount: p.completedJobsCount,
      isTopPro: p.isTopPro,
      responseTimeMinutes: p.responseTimeMinutes ?? null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}

export const proRepository: ProRepository = new ProRepositoryImpl();
