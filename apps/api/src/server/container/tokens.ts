/**
 * Dependency injection tokens
 * Used to register and resolve dependencies in TSyringe container
 */

// Repository tokens
export const TOKENS = {
  // Repositories
  BookingRepository: "BookingRepository",
  PaymentRepository: "PaymentRepository",
  PaymentEventRepository: "PaymentEventRepository",
  ProRepository: "ProRepository",
  ReviewRepository: "ReviewRepository",
  UserRepository: "UserRepository",
  AvailabilityRepository: "AvailabilityRepository",

  // Services
  BookingService: "BookingService",
  PaymentService: "PaymentService",
  PaymentServiceFactory: "PaymentServiceFactory",
  ProService: "ProService",
  ReviewService: "ReviewService",

  // Infrastructure
  Logger: "Logger",
  AuthProvider: "AuthProvider",
} as const;
