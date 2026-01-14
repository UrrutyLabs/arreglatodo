import { injectable, inject } from "tsyringe";
import type { BookingRepository } from "./booking.repo";
import type { ProRepository } from "@modules/pro/pro.repo";
import type {
  BookingCreateInput,
  BookingCreateOutput,
} from "@repo/domain";
import type { Actor } from "@infra/auth/roles";
import { TOKENS } from "@/server/container";
import type { ClientProfileService } from "@modules/user/clientProfile.service";
import type { NotificationService } from "@modules/notification/notification.service";
import { adaptToDomain, sendClientNotification } from "./booking.helpers";

/**
 * Booking creation service
 * Handles booking creation workflow
 */
@injectable()
export class BookingCreationService {
  constructor(
    @inject(TOKENS.BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @inject(TOKENS.ProRepository)
    private readonly proRepository: ProRepository,
    @inject(TOKENS.ClientProfileService)
    private readonly clientProfileService: ClientProfileService,
    @inject(TOKENS.NotificationService)
    private readonly notificationService: NotificationService
  ) {}

  /**
   * Create a new booking
   * Business rules:
   * - Pro must exist and be active
   * - Set initial status to PENDING_PAYMENT (payment required before pro can accept)
   */
  async createBooking(
    actor: Actor,
    input: BookingCreateInput
  ): Promise<BookingCreateOutput> {
    // Ensure client profile exists (lazy creation)
    await this.clientProfileService.ensureClientProfileExists(actor.id);

    // Validate pro exists
    const pro = await this.proRepository.findById(input.proId);
    if (!pro) {
      throw new Error("Pro not found");
    }

    if (pro.status === "suspended") {
      throw new Error("Pro is suspended");
    }

    // Create booking via repository
    const booking = await this.bookingRepository.create({
      clientUserId: actor.id,
      proProfileId: input.proId,
      category: input.category as string,
      scheduledAt: input.scheduledAt,
      hoursEstimate: input.estimatedHours,
      addressText: input.description,
    });

    // Send notification to client
    await sendClientNotification(
      booking,
      "booking.created",
      "Tu reserva fue creada",
      `Tu reserva #${booking.id} fue creada exitosamente. El profesional ${pro.displayName} recibirá tu solicitud.`,
      `<p>Tu reserva <strong>#${booking.id}</strong> fue creada exitosamente.</p><p>El profesional <strong>${pro.displayName}</strong> recibirá tu solicitud y te notificaremos cuando la acepte.</p>`,
      this.notificationService,
      this.clientProfileService,
      this.proRepository
    );

    // Adapt to domain type for router compatibility
    return adaptToDomain(booking, input, pro.hourlyRate);
  }
}
