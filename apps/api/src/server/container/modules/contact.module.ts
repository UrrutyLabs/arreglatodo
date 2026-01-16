import type { DependencyContainer } from "tsyringe";
import { TOKENS } from "../tokens";
import { ContactService } from "@modules/contact/contact.service";

/**
 * Register contact module dependencies
 */
export function registerContactModule(container: DependencyContainer): void {
  // Register service
  container.register(TOKENS.ContactService, {
    useClass: ContactService,
  });
}
