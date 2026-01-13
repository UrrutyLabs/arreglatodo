import { DependencyContainer } from "tsyringe";
import { TOKENS } from "../tokens";
import {
  AuditLogRepository,
  AuditLogRepositoryImpl,
} from "@modules/audit/audit.repo";
import { AuditService } from "@modules/audit/audit.service";

/**
 * Register Audit module dependencies
 */
export function registerAuditModule(container: DependencyContainer): void {
  // Register repository
  container.register<AuditLogRepository>(TOKENS.AuditLogRepository, {
    useClass: AuditLogRepositoryImpl,
  });

  // Register service (auto-resolves dependencies)
  container.register<AuditService>(TOKENS.AuditService, {
    useClass: AuditService,
  });
}
