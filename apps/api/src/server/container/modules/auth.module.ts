import { DependencyContainer } from "tsyringe";
import { TOKENS } from "../tokens";
import { AuthService } from "@modules/auth/auth.service";

/**
 * Register Auth module dependencies
 * Depends on User module (UserRepository, ClientProfileService)
 */
export function registerAuthModule(container: DependencyContainer): void {
  container.register<AuthService>(TOKENS.AuthService, {
    useClass: AuthService,
  });
}
