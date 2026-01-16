import { DependencyContainer } from "tsyringe";
import { TOKENS } from "../tokens";
import { SearchService } from "@modules/search/search.service";

/**
 * Register Search module dependencies
 * Depends on: ProService
 */
export function registerSearchModule(container: DependencyContainer): void {
  // Register service (auto-resolves dependencies)
  container.register<SearchService>(TOKENS.SearchService, {
    useClass: SearchService,
  });
}
