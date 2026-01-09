import { prisma } from "../db/prisma";

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
  hourlyRate: number;
  categories: string[]; // Category enum values
  serviceArea: string | null;
  status: "pending" | "active" | "suspended";
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
  phone?: string;
  bio?: string;
  hourlyRate: number;
  categories: string[]; // Category enum values
  serviceArea?: string;
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
  updateStatus(
    id: string,
    status: "pending" | "active" | "suspended"
  ): Promise<ProProfileEntity | null>;
  update(
    id: string,
    data: Partial<ProProfileCreateInput>
  ): Promise<ProProfileEntity | null>;
}

/**
 * ProProfile repository implementation using Prisma
 */
class ProRepositoryImpl implements ProRepository {
  async create(input: ProProfileCreateInput): Promise<ProProfileEntity> {
    const proProfile = await prisma.proProfile.create({
      data: {
        userId: input.userId,
        displayName: input.displayName,
        email: input.email,
        phone: input.phone ?? null,
        bio: input.bio,
        hourlyRate: input.hourlyRate,
        categories: input.categories as any, // Prisma expects Category[] enum, but we pass string[]
        serviceArea: input.serviceArea ?? null,
        status: "pending",
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

    return proProfile ? this.mapPrismaToDomain(proProfile) : null;
  }

  async findAll(): Promise<ProProfileEntity[]> {
    const proProfiles = await prisma.proProfile.findMany({
      orderBy: { createdAt: "desc" },
    });

    return proProfiles.map(this.mapPrismaToDomain);
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
    data: Partial<ProProfileCreateInput>
  ): Promise<ProProfileEntity | null> {
    const updateData: any = { ...data };
    if (data.categories) {
      updateData.categories = data.categories as any;
    }
    
    const proProfile = await prisma.proProfile.update({
      where: { id },
      data: updateData,
    });

    return this.mapPrismaToDomain(proProfile);
  }

  private mapPrismaToDomain(prismaProProfile: any): ProProfileEntity {
    return {
      id: prismaProProfile.id,
      userId: prismaProProfile.userId,
      displayName: prismaProProfile.displayName,
      email: prismaProProfile.email ?? "",
      phone: prismaProProfile.phone ?? null,
      bio: prismaProProfile.bio ?? null,
      hourlyRate: prismaProProfile.hourlyRate,
      categories: (prismaProProfile.categories ?? []) as string[],
      serviceArea: prismaProProfile.serviceArea ?? null,
      status: prismaProProfile.status as "pending" | "active" | "suspended",
      createdAt: prismaProProfile.createdAt,
      updatedAt: prismaProProfile.updatedAt,
    };
  }
}

export const proRepository: ProRepository = new ProRepositoryImpl();
