import { injectable } from "tsyringe";
import { prisma } from "@infra/db/prisma";

/**
 * PayoutItem entity (plain object)
 */
export interface PayoutItemEntity {
  id: string;
  payoutId: string;
  earningId: string;
  amount: number; // minor units
  createdAt: Date;
}

/**
 * PayoutItem create input
 */
export interface PayoutItemCreateInput {
  payoutId: string;
  earningId: string;
  amount: number; // minor units
}

/**
 * PayoutItem repository interface
 * Handles all data access for payout items
 */
export interface PayoutItemRepository {
  createMany(
    payoutId: string,
    items: Array<{ earningId: string; amount: number }>
  ): Promise<PayoutItemEntity[]>;
  findByPayoutId(payoutId: string): Promise<PayoutItemEntity[]>;
}

/**
 * PayoutItem repository implementation using Prisma
 */
@injectable()
export class PayoutItemRepositoryImpl implements PayoutItemRepository {
  async createMany(
    payoutId: string,
    items: Array<{ earningId: string; amount: number }>
  ): Promise<PayoutItemEntity[]> {
    // Prisma createMany doesn't return created records
    // So we create individually to get the full entities
    const created = await Promise.all(
      items.map((item) =>
        prisma.payoutItem.create({
          data: {
            payoutId,
            earningId: item.earningId,
            amount: item.amount,
          },
        })
      )
    );

    return created.map(this.mapPrismaToDomain);
  }

  async findByPayoutId(payoutId: string): Promise<PayoutItemEntity[]> {
    const items = await prisma.payoutItem.findMany({
      where: { payoutId },
      orderBy: {
        createdAt: "asc",
      },
    });

    return items.map(this.mapPrismaToDomain);
  }

  private mapPrismaToDomain(prismaItem: {
    id: string;
    payoutId: string;
    earningId: string;
    amount: number;
    createdAt: Date;
  }): PayoutItemEntity {
    return {
      id: prismaItem.id,
      payoutId: prismaItem.payoutId,
      earningId: prismaItem.earningId,
      amount: prismaItem.amount,
      createdAt: prismaItem.createdAt,
    };
  }
}
