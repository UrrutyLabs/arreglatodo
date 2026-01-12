import { DependencyContainer } from "tsyringe";
import { TOKENS } from "../tokens";
import {
  BookingRepository,
  BookingRepositoryImpl,
} from "@modules/booking/booking.repo";
import { BookingService } from "@modules/booking/booking.service";

/**
 * Register Booking module dependencies
 * Depends on: ProRepository, PaymentServiceFactory (injected via container)
 */
export function registerBookingModule(container: DependencyContainer): void {
  // Register repository
  container.register<BookingRepository>(TOKENS.BookingRepository, {
    useClass: BookingRepositoryImpl,
  });

  // Register service (auto-resolves ProRepository and PaymentServiceFactory from container)
  container.register<BookingService>(TOKENS.BookingService, {
    useClass: BookingService,
  });
}
