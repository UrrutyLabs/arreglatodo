import { DependencyContainer } from "tsyringe";
import { TOKENS } from "../tokens";
import {
  ReviewRepository,
  ReviewRepositoryImpl,
} from "@modules/review/review.repo";
import { ReviewService } from "@modules/review/review.service";

/**
 * Register Review module dependencies
 * Depends on: BookingRepository, ProRepository (injected via container)
 */
export function registerReviewModule(container: DependencyContainer): void {
  // Register repository
  container.register<ReviewRepository>(TOKENS.ReviewRepository, {
    useClass: ReviewRepositoryImpl,
  });

  // Register service (auto-resolves BookingRepository and ProRepository from container)
  container.register<ReviewService>(TOKENS.ReviewService, {
    useClass: ReviewService,
  });
}
