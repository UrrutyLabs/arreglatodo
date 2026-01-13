import { container as tsyringeContainer, DependencyContainer } from "tsyringe";
import { registerInfrastructureModule } from "./modules/infrastructure.module";
import { registerUserModule } from "./modules/user.module";
import { registerAuthModule } from "./modules/auth.module";
import { registerProModule } from "./modules/pro.module";
import { registerReviewModule } from "./modules/review.module";
import { registerBookingModule } from "./modules/booking.module";
import { registerPaymentModule } from "./modules/payment.module";
import { registerNotificationModule } from "./modules/notification.module";
import { registerPushModule } from "./modules/push.module";
import { registerPayoutModule } from "./modules/payout.module";
import { registerAuditModule } from "./modules/audit.module";

/**
 * Setup and configure the dependency injection container
 * Registers all modules in dependency order:
 * 1. Infrastructure (foundation)
 * 2. User (foundation)
 * 3. Pro, Review (depend on User)
 * 4. Booking, Payment (depend on Pro/Review)
 */
export function setupContainer(): DependencyContainer {
  // Register foundation modules first
  registerInfrastructureModule(tsyringeContainer);
  registerUserModule(tsyringeContainer);
  registerAuthModule(tsyringeContainer); // Depends on User module

  // Register modules that depend on foundation
  registerProModule(tsyringeContainer);
  registerReviewModule(tsyringeContainer);

  // Register modules that depend on others
  registerNotificationModule(tsyringeContainer); // Register before BookingModule (BookingService depends on NotificationService)
  registerBookingModule(tsyringeContainer);
  registerPayoutModule(tsyringeContainer); // Register before PaymentModule (PaymentServiceFactory needs EarningService)
  registerPaymentModule(tsyringeContainer);
  registerPushModule(tsyringeContainer);
  registerAuditModule(tsyringeContainer); // Register audit module (can be used by any service)

  return tsyringeContainer;
}

// Create and export the configured container
export const container = setupContainer();
