import { injectable, inject } from "tsyringe";
import type { ProPayoutProfileRepository } from "./proPayoutProfile.repo";
import type { ProRepository } from "@modules/pro/pro.repo";
import type { Actor } from "@infra/auth/roles";
import { Role } from "@repo/domain";
import { TOKENS } from "@/server/container/tokens";

/**
 * Error thrown when payout profile operation fails
 */
export class ProPayoutProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProPayoutProfileError";
  }
}

/**
 * Pro payout profile update input
 */
export interface ProPayoutProfileUpdateInput {
  fullName?: string | null;
  documentId?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountType?: string | null;
}

/**
 * Pro payout profile service
 * Contains business logic for pro payout profile operations
 */
@injectable()
export class ProPayoutProfileService {
  constructor(
    @inject(TOKENS.ProPayoutProfileRepository)
    private readonly proPayoutProfileRepository: ProPayoutProfileRepository,
    @inject(TOKENS.ProRepository)
    private readonly proRepository: ProRepository
  ) {}

  /**
   * Get or create payout profile for a pro
   * Ensures profile exists for the actor's pro profile
   */
  async getOrCreateForPro(actor: Actor): Promise<{
    id: string;
    proProfileId: string;
    payoutMethod: "BANK_TRANSFER";
    fullName: string | null;
    documentId: string | null;
    bankName: string | null;
    bankAccountType: string | null;
    bankAccountNumber: string | null;
    currency: string;
    isComplete: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> {
    // Authorization: Actor must be a pro
    if (actor.role !== Role.PRO) {
      throw new ProPayoutProfileError("Only pros can access payout profiles");
    }

    // Get pro profile for actor
    const proProfile = await this.proRepository.findByUserId(actor.id);
    if (!proProfile) {
      throw new ProPayoutProfileError("Pro profile not found");
    }

    // Get or create payout profile
    let profile = await this.proPayoutProfileRepository.findByProProfileId(
      proProfile.id
    );

    if (!profile) {
      // Create profile with defaults
      profile = await this.proPayoutProfileRepository.upsertForProProfile(
        proProfile.id,
        {
          payoutMethod: "BANK_TRANSFER",
          currency: "UYU",
          isComplete: false,
        }
      );
    }

    return {
      id: profile.id,
      proProfileId: profile.proProfileId,
      payoutMethod: profile.payoutMethod,
      fullName: profile.fullName,
      documentId: profile.documentId,
      bankName: profile.bankName,
      bankAccountType: profile.bankAccountType,
      // TODO: Encrypt bankAccountNumber before storing (use secret storage)
      bankAccountNumber: profile.bankAccountNumber,
      currency: profile.currency,
      isComplete: profile.isComplete,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  /**
   * Update payout profile for a pro
   * Allows updating fields and recomputes isComplete status
   * Required for MVP: fullName + bankAccountNumber
   * Optional: documentId, bankName
   */
  async updateForPro(
    actor: Actor,
    patch: ProPayoutProfileUpdateInput
  ): Promise<{
    id: string;
    proProfileId: string;
    payoutMethod: "BANK_TRANSFER";
    fullName: string | null;
    documentId: string | null;
    bankName: string | null;
    bankAccountType: string | null;
    bankAccountNumber: string | null;
    currency: string;
    isComplete: boolean;
    createdAt: Date;
    updatedAt: Date;
  }> {
    // Authorization: Actor must be a pro
    if (actor.role !== Role.PRO) {
      throw new ProPayoutProfileError("Only pros can update payout profiles");
    }

    // Get pro profile for actor
    const proProfile = await this.proRepository.findByUserId(actor.id);
    if (!proProfile) {
      throw new ProPayoutProfileError("Pro profile not found");
    }

    // Get current profile to merge with patch
    const currentProfile =
      await this.proPayoutProfileRepository.findByProProfileId(proProfile.id);

    // Merge current values with patch
    const updatedFields: {
      fullName?: string | null;
      documentId?: string | null;
      bankName?: string | null;
      bankAccountType?: string | null;
      bankAccountNumber?: string | null;
    } = {};

    if (patch.fullName !== undefined) {
      updatedFields.fullName = patch.fullName;
    } else if (currentProfile) {
      updatedFields.fullName = currentProfile.fullName;
    }

    if (patch.documentId !== undefined) {
      updatedFields.documentId = patch.documentId;
    } else if (currentProfile) {
      updatedFields.documentId = currentProfile.documentId;
    }

    if (patch.bankName !== undefined) {
      updatedFields.bankName = patch.bankName;
    } else if (currentProfile) {
      updatedFields.bankName = currentProfile.bankName;
    }

    if (patch.bankAccountType !== undefined) {
      updatedFields.bankAccountType = patch.bankAccountType;
    } else if (currentProfile) {
      updatedFields.bankAccountType = currentProfile.bankAccountType;
    }

    if (patch.bankAccountNumber !== undefined) {
      // TODO: Encrypt bankAccountNumber before storing (use secret storage)
      updatedFields.bankAccountNumber = patch.bankAccountNumber;
    } else if (currentProfile) {
      updatedFields.bankAccountNumber = currentProfile.bankAccountNumber;
    }

    // Compute isComplete based on required fields
    // Required for MVP: fullName + bankAccountNumber
    const isComplete =
      !!updatedFields.fullName && !!updatedFields.bankAccountNumber;

    // Update profile
    const updated = await this.proPayoutProfileRepository.upsertForProProfile(
      proProfile.id,
      {
        ...updatedFields,
        isComplete,
      }
    );

    return {
      id: updated.id,
      proProfileId: updated.proProfileId,
      payoutMethod: updated.payoutMethod,
      fullName: updated.fullName,
      documentId: updated.documentId,
      bankName: updated.bankName,
      bankAccountType: updated.bankAccountType,
      // TODO: Decrypt bankAccountNumber before returning (use secret storage)
      bankAccountNumber: updated.bankAccountNumber,
      currency: updated.currency,
      isComplete: updated.isComplete,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
