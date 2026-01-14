# Backend Best Practices (API)

## Goals

- Keep codebases maintainable as features grow
- Make business logic testable and framework-agnostic
- Enforce consistent boundaries and naming
- Follow SOLID principles pragmatically (no over-engineering)

## API Architecture (tRPC + Next.js)

Even though this isn't Express/Nest, we still follow a Controller → Service → Repository style separation.

### Layers (mapping to tRPC)

#### 1. "Controllers" = tRPC Routers / Procedures

**Location:** `apps/api/src/server/modules/{domain}/{domain}.router.ts`

**Responsibilities:**

- Validate input (Zod schemas from packages/domain)
- Authorization (role-based checks)
- Call service methods
- Translate known failures to TRPCError

**Rules:**

- Keep procedures thin
- No direct DB access in routers
- No third-party SDK calls in routers

#### 2. Services = Business Logic / Use Cases

**Location:** `apps/api/src/server/modules/{domain}/{domain}.service.ts`

**Responsibilities:**

- Marketplace business rules (booking lifecycle, availability, cancellations, payouts)
- Orchestrate repositories and integrations
- Return domain-friendly results (not HTTP concerns)

**Rules:**

- Services may depend on repositories and integrations
- Services should be unit-testable without Next.js/tRPC
- Services should not import `next/*` or route handler code

#### 3. Repositories = Data Access Layer

**Location:** `apps/api/src/server/repositories/*`

**Responsibilities:**

- All reads/writes to the database (Prisma)
- Encapsulate queries, joins, transactions
- Return plain objects (entities) to services

**Rules:**

- Repositories should not implement business rules
- Repositories should not call external APIs
- Prefer transactions here (or via service orchestration when needed)
- **Prisma types are allowed in `mapPrismaToDomain` methods**: Import `Prisma` types from the generated client to properly type mapper functions. This is the only place where Prisma types should be used - they should not leak to services or other layers.

#### 4. Integrations = External Providers

**Location:** `apps/api/src/server/modules/{domain}/providers/*` (e.g., `modules/payment/providers/mercadoPago.client.ts`)

**Responsibilities:**

- Wrap 3rd party SDKs (Mercado Pago, notifications, identity verification)
- Normalize inputs/outputs
- Verify signatures for webhooks
- Implement provider interfaces (e.g., `PaymentProviderClient`)

**Rules:**

- Expose a small interface used by services
- No business logic in integration modules
- Provider implementations are module-specific and live within the module

#### 5. HTTP Routes (Webhooks/Cron) = Next Route Handlers

**Location:** `apps/api/src/app/api/*`

**Responsibilities:**

- Handle provider callbacks (webhooks)
- Validate signatures and parse payloads
- Call services to update internal state

**Rules:**

- Keep routes thin like controllers
- Do not put business rules inside route handlers

### API Folder Convention (Module-Based Structure)

The API follows a **module-based architecture** where each domain module is self-contained. This structure reflects the dependency injection modules and makes it easy to extract modules into microservices later.

```
apps/api/src/server/
  modules/                    # Domain modules (self-contained)
    booking/                  # Booking domain module
      booking.service.ts      # Business logic
      booking.repo.ts         # Data access
      booking.router.ts       # tRPC routes
      booking.errors.ts       # Domain errors
    payment/                  # Payment domain module
      payment.service.ts
      payment.repo.ts
      paymentEvent.repo.ts
      payment.router.ts
      payment.errors.ts       # (to be added)
      provider.ts             # Payment provider interface
      registry.ts             # Provider registry
      providers/              # Provider implementations
        mercadoPago.client.ts
    pro/                      # Pro domain module
      pro.service.ts
      pro.repo.ts
      availability.repo.ts
      pro.router.ts
      pro.errors.ts           # (to be added)
    review/                   # Review domain module
      review.service.ts
      review.repo.ts
      review.router.ts
      review.errors.ts
    user/                     # User domain module (foundational)
      user.repo.ts
  infrastructure/             # Shared infrastructure
    auth/                     # Authentication & authorization
      roles.ts
      provider.ts
      providers/
        supabase.provider.ts
    db/                       # Database (Prisma client)
      prisma.ts
    utils/                    # Utilities
      logger.ts
    trpc/                     # tRPC setup
      context.ts
    trpc.ts                   # tRPC initialization
  container/                  # Dependency injection
    container.ts              # Main container setup
    tokens.ts                 # DI tokens
    modules/                  # Module registrations
      booking.module.ts
      payment.module.ts
      pro.module.ts
      review.module.ts
      user.module.ts
      infrastructure.module.ts
    index.ts                  # Container exports
  routers/                    # Root router
    _app.ts                   # Main app router (combines module routers)
    auth.router.ts            # Auth routes
  shared/                     # Shared across modules
    errors/                   # Shared error mapper
      error-mapper.ts
```

**Module Structure:**
Each module (`modules/{domain}/`) contains:
- `{domain}.service.ts` - Business logic
- `{domain}.repo.ts` - Data access (may have multiple repos)
- `{domain}.router.ts` - tRPC routes
- `{domain}.errors.ts` - Domain-specific errors
- Domain-specific files (e.g., `payment/provider.ts`, `payment/registry.ts`)

**Benefits:**
- Clear module boundaries for microservices extraction
- Self-contained modules (easy to test in isolation)
- Matches DI module structure
- Easy to find all code related to a domain

### Dependency Injection with TSyringe

The API uses **TSyringe** for dependency injection, enabling modular architecture and easy testing.

**Container Setup:**
- Main container: `container/container.ts`
- Module registrations: `container/modules/{domain}.module.ts`
- DI tokens: `container/tokens.ts`

**Module Registration:**
Each module registers its dependencies in `container/modules/{domain}.module.ts`:
```typescript
export function registerBookingModule(container: DependencyContainer): void {
  container.register<BookingRepository>(TOKENS.BookingRepository, {
    useClass: BookingRepositoryImpl,
  });
  container.register<BookingService>(TOKENS.BookingService, {
    useClass: BookingService,
  });
}
```

**Using DI in Services:**
```typescript
@injectable()
export class BookingService {
  constructor(
    @inject(TOKENS.BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @inject(TOKENS.ProRepository)
    private readonly proRepository: ProRepository
  ) {}
}
```

**Using DI in Routers:**
```typescript
import { container, TOKENS } from "../../container";
const bookingService = container.resolve<BookingService>(TOKENS.BookingService);
```

**Rules:**
- All services and repositories are `@injectable()`
- Use `@inject(TOKENS.TokenName)` for constructor injection
- Import types with `import type` when used in decorators
- Cross-module dependencies are injected via DI (not direct imports)
- Container is initialized once at startup in `container/container.ts`

### SOLID rules for the API

#### Single Responsibility

- Routers validate + authorize + delegate
- Services handle business rules
- Repos handle persistence only

#### Open/Closed

- Add new behavior by adding new services/procedures
- Avoid modifying a "god service" for unrelated features

#### Liskov Substitution

- If introducing interfaces (e.g., PaymentProvider), implement them consistently
- Tests should pass regardless of provider implementation

#### Interface Segregation

- Prefer small interfaces:
  - `PaymentProvider.charge()` vs a huge "PaymentService" with 30 methods

#### Dependency Inversion

- Services depend on abstractions when it helps (e.g., `PaymentProviderClient`)
- Concrete implementations live in module `providers/` directories
- Use TSyringe DI container (`container/`) to assemble dependencies
- Modules register their dependencies in `container/modules/{module}.module.ts`
- Cross-module dependencies are injected via DI (e.g., `BookingService` depends on `PaymentServiceFactory`)

### Module Boundaries and Cross-Module Dependencies

**Module Independence:**
- Each module (`modules/{domain}/`) is self-contained
- Modules can depend on other modules via DI (injected dependencies)
- Avoid circular dependencies between modules

**Dependency Flow:**
```
User (foundation)
  ↓
Pro, Review (depend on User)
  ↓
Booking, Payment (depend on Pro/Review)
```

**Cross-Module Access:**
- Use dependency injection to access other modules
- Import types with `import type` for cross-module type references
- Access via container: `container.resolve<ServiceType>(TOKENS.ServiceToken)`
- Do NOT import services/repos directly across modules (use DI)

### Naming Conventions (API)

- **Routers:** `{domain}.router.ts` (e.g., `booking.router.ts`, `payment.router.ts`)
- **Services:** `{domain}.service.ts` (e.g., `booking.service.ts`, `payment.service.ts`)
- **Repositories:** `{domain}.repo.ts` or `{domain}{entity}.repo.ts` (e.g., `booking.repo.ts`, `paymentEvent.repo.ts`)
- **Errors:** `{domain}.errors.ts` (e.g., `booking.errors.ts`, `payment.errors.ts`)
- **Providers:** `{provider}.client.ts` (e.g., `mercadoPago.client.ts`) in `modules/{domain}/providers/`
- **Module Registration:** `{domain}.module.ts` in `container/modules/`
- **Zod schemas:** `BookingCreateInputSchema`, `ProOnboardInputSchema` (in `@repo/domain`)

## Frontend Architecture

For frontend-specific best practices, see [FE_BEST_PRACTICES.md](./FE_BEST_PRACTICES.md).

**Key Points:**
- Frontend uses hooks to encapsulate tRPC queries/mutations (no direct `trpc` access in screens)
- Screens orchestrate data fetching and user actions
- Presentational components are pure (props in, JSX out)
- Complex UI is broken into subcomponents
- Utility functions handle formatting and transformations

## "Do / Don't" Summary

### DO

- Keep routers thin
- Put business rules in services
- Put DB queries in repositories
- Use integrations for external APIs
- Use containers/screens for data fetching
- Keep components presentational when possible

### DON'T

- Don't query Prisma inside routers
- Don't put business logic in route handlers
- Don't create "god services" that own everything
- Don't import services/repos directly across modules (use DI)
- Don't use lazy imports (`await import()`) unless absolutely necessary (DI handles dependencies)
- Don't create circular dependencies between modules
