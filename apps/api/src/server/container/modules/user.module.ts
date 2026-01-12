import { DependencyContainer } from "tsyringe";
import { TOKENS } from "../tokens";
import {
  UserRepository,
  UserRepositoryImpl,
} from "@modules/user/user.repo";

/**
 * Register User module dependencies
 * Foundation module - no dependencies on other modules
 */
export function registerUserModule(container: DependencyContainer): void {
  container.register<UserRepository>(TOKENS.UserRepository, {
    useClass: UserRepositoryImpl,
  });
}
