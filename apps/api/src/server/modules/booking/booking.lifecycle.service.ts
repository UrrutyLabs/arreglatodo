import { injectable, inject } from "tsyringe";
import type { BookingRepository, BookingEntity } from "./booking.repo";
import type { ProRepository } from "@modules/pro/pro.repo";
import { BookingStatus } from "@repo/domain";
import type { Actor } from "@infra/auth/roles";
import { TOKENS } from "@/server/container";
import { BookingNotFoundError } from "./booking.errors";
import type { ClientProfileService } from "@modules/user/clientProfile.service";
import type { NotificationService } from "@modules/notification/notification.service";
import {
  validateStateTransition,
  authorizeProAction,
  authorizeClientAction,
  sendClientNotification,
} from "./booking.helpers";

/**
 * Booking lifecycle service
 * Handles all state transitions (accept, reject, cancel, markOnMyWay, arrive)
 */
@injectable()
export class BookingLifecycleService {
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
   * Get booking or throw error
   */
  private async getBookingOrThrow(bookingId: string): Promise<BookingEntity> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new BookingNotFoundError(bookingId);
    }
    return booking;
  }

  /**
   * Accept a booking (PENDING -> ACCEPTED)
   * Authorization: Pro assigned to booking or Admin
   */
  async acceptBooking(actor: Actor, bookingId: string): Promise<BookingEntity> {
    const booking = await this.getBookingOrThrow(bookingId);

    // Validate state transition
    validateStateTransition(booking.status, BookingStatus.ACCEPTED);

    // Authorization: Pro must be assigned to booking, or actor must be admin
    await authorizeProAction(
      actor,
      booking,
      "accept booking",
      this.proRepository
    );

    // Update status
    const updated = await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.ACCEPTED
    );
    if (!updated) {
      throw new BookingNotFoundError(bookingId);
    }

    // Send notification to client
    const pro = await this.proRepository.findById(updated.proProfileId!);
    await sendClientNotification(
      updated,
      "booking.accepted",
      "¡Tu reserva fue aceptada!",
      `Tu reserva #${updated.id} fue aceptada por ${pro?.displayName || "el profesional"}.`,
      `<p>¡Excelente noticia!</p><p>Tu reserva <strong>#${updated.id}</strong> fue aceptada por <strong>${pro?.displayName || "el profesional"}</strong>.</p><p>Te notificaremos cuando esté en camino.</p>`,
      this.notificationService,
      this.clientProfileService,
      this.proRepository
    );

    return updated;
  }

  /**
   * Reject a booking (PENDING -> REJECTED)
   * Authorization: Pro assigned to booking or Admin
   */
  async rejectBooking(actor: Actor, bookingId: string): Promise<BookingEntity> {
    const booking = await this.getBookingOrThrow(bookingId);

    // Validate state transition
    validateStateTransition(booking.status, BookingStatus.REJECTED);

    // Authorization: Pro must be assigned to booking, or actor must be admin
    await authorizeProAction(
      actor,
      booking,
      "reject booking",
      this.proRepository
    );

    // Update status
    const updated = await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.REJECTED
    );
    if (!updated) {
      throw new BookingNotFoundError(bookingId);
    }

    // Send notification to client
    const pro = await this.proRepository.findById(updated.proProfileId!);
    await sendClientNotification(
      updated,
      "booking.rejected",
      "Tu reserva fue rechazada",
      `Lamentablemente, tu reserva #${updated.id} fue rechazada por ${pro?.displayName || "el profesional"}.`,
      `<p>Lamentablemente, tu reserva <strong>#${updated.id}</strong> fue rechazada por <strong>${pro?.displayName || "el profesional"}</strong>.</p><p>Podés buscar otro profesional disponible.</p>`,
      this.notificationService,
      this.clientProfileService,
      this.proRepository
    );

    return updated;
  }

  /**
   * Mark booking as on my way (ACCEPTED -> ON_MY_WAY)
   * Authorization: Pro assigned to booking or Admin
   */
  async markOnMyWay(actor: Actor, bookingId: string): Promise<BookingEntity> {
    const booking = await this.getBookingOrThrow(bookingId);

    // Validate state transition
    validateStateTransition(booking.status, BookingStatus.ON_MY_WAY);

    // Authorization: Pro must be assigned to booking, or actor must be admin
    await authorizeProAction(
      actor,
      booking,
      "mark on my way",
      this.proRepository
    );

    // Update status
    const updated = await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.ON_MY_WAY
    );
    if (!updated) {
      throw new Error("Failed to update booking status");
    }

    // Send notification to client
    const pro = await this.proRepository.findById(updated.proProfileId!);
    await sendClientNotification(
      updated,
      "booking.on_my_way",
      "El profesional está en camino",
      `${pro?.displayName || "El profesional"} está en camino a tu ubicación para la reserva #${updated.id}.`,
      `<p><strong>${pro?.displayName || "El profesional"}</strong> está en camino a tu ubicación.</p><p>Reserva: <strong>#${updated.id}</strong></p>`,
      this.notificationService,
      this.clientProfileService,
      this.proRepository
    );

    return updated;
  }

  /**
   * Mark booking as arrived (ON_MY_WAY -> ARRIVED)
   * Authorization: Pro assigned to booking or Admin
   */
  async arriveBooking(actor: Actor, bookingId: string): Promise<BookingEntity> {
    const booking = await this.getBookingOrThrow(bookingId);

    // Validate state transition
    validateStateTransition(booking.status, BookingStatus.ARRIVED);

    // Authorization: Pro must be assigned to booking, or actor must be admin
    await authorizeProAction(
      actor,
      booking,
      "arrive booking",
      this.proRepository
    );

    // Update status
    const updated = await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.ARRIVED
    );
    if (!updated) {
      throw new BookingNotFoundError(bookingId);
    }

    // Send notification to client
    const pro = await this.proRepository.findById(updated.proProfileId!);
    await sendClientNotification(
      updated,
      "booking.arrived",
      "El profesional llegó",
      `${pro?.displayName || "El profesional"} llegó a tu ubicación para la reserva #${updated.id}.`,
      `<p><strong>${pro?.displayName || "El profesional"}</strong> llegó a tu ubicación.</p><p>Reserva: <strong>#${updated.id}</strong></p>`,
      this.notificationService,
      this.clientProfileService,
      this.proRepository
    );

    return updated;
  }

  /**
   * Cancel a booking (PENDING -> CANCELLED or ACCEPTED -> CANCELLED)
   * Authorization: Client who owns booking, or Admin
   */
  async cancelBooking(actor: Actor, bookingId: string): Promise<BookingEntity> {
    const booking = await this.getBookingOrThrow(bookingId);

    // Validate state transition
    validateStateTransition(booking.status, BookingStatus.CANCELLED);

    // Authorization: Client must own booking, or actor must be admin
    authorizeClientAction(actor, booking, "cancel booking");

    // Update status
    const updated = await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.CANCELLED
    );
    if (!updated) {
      throw new BookingNotFoundError(bookingId);
    }

    return updated;
  }
}
