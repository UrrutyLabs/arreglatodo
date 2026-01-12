# Architecture Best Practices (API + Frontends)

## Goals

- Keep codebases maintainable as features grow
- Make business logic testable and framework-agnostic
- Enforce consistent boundaries and naming
- Follow SOLID principles pragmatically (no over-engineering)

## API Architecture (tRPC + Next.js)

Even though this isn't Express/Nest, we still follow a Controller → Service → Repository style separation.

### Layers (mapping to tRPC)

#### 1. "Controllers" = tRPC Routers / Procedures

**Location:** `apps/api/src/server/routers/*`

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

**Location:** `apps/api/src/server/services/*`

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

**Location:** `apps/api/src/server/integrations/*`

**Responsibilities:**

- Wrap 3rd party SDKs (Mercado Pago, notifications, identity verification)
- Normalize inputs/outputs
- Verify signatures for webhooks

**Rules:**

- Expose a small interface used by services
- No business logic in integration modules

#### 5. HTTP Routes (Webhooks/Cron) = Next Route Handlers

**Location:** `apps/api/src/app/api/*`

**Responsibilities:**

- Handle provider callbacks (webhooks)
- Validate signatures and parse payloads
- Call services to update internal state

**Rules:**

- Keep routes thin like controllers
- Do not put business rules inside route handlers

### API Folder Convention (recommended)

```
apps/api/src/server/
  routers/        # controller layer (tRPC procedures)
  services/       # business logic / use cases
  repositories/   # prisma/db access
  integrations/   # 3rd party providers
  db/             # prisma client singleton
  auth/           # guards, roles
  errors/         # domain errors and mapping to TRPCError
```

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

- Services depend on abstractions when it helps (e.g., PaymentProvider)
- Concrete implementations live in `integrations/*`
- Use composition in `services/*` or a `container.ts` to assemble dependencies

### Naming Conventions (API)

- **Routers:** `booking.router.ts`, `pro.router.ts` (or `booking.ts` if you prefer)
- **Services:** `booking.service.ts`
- **Repositories:** `booking.repo.ts`
- **Integrations:** `mercadopago.client.ts`
- **Zod schemas:** `BookingCreateInputSchema`, `ProOnboardInputSchema`

## Frontend Architecture (Next.js web + Expo mobile)

We use a clean separation between presentational components and container components, and keep business logic out of UI.

### Layers

#### 1. Presentational Components (UI-only)

**Responsibilities:**

- Render UI from props
- No API calls
- No global state access
- Minimal logic (formatting, simple conditionals)

**Examples:**

- `ProCard`, `BookingForm`, `RatingStars`

**Rule of thumb:**

If it can be rendered in Storybook with mock props, it's presentational.

#### 2. Containers (Smart Components / Screens)

**Responsibilities:**

- Fetch data (tRPC queries)
- Call mutations
- Handle loading/error states
- Map API/domain data to UI props

**Examples:**

- `SearchProsScreen`, `BookingCreateScreen`

#### 3. Hooks (Reusable logic)

**Responsibilities:**

- Encapsulate repeated controller logic (fetch + transform + caching)

**Example:**

- `useSearchPros()`
- `useCreateBooking()`

#### 4. State Management

**MVP guidance:**

- Use React Query (via tRPC) as the primary async state
- Keep global state minimal (auth/session, UI preferences)
- Prefer local state for forms

### Frontend Folder Convention (recommended)

**Next.js apps (apps/client, apps/admin)**

```
src/
  app/          # Next routes + layouts
  screens/      # container-level screens (smart)
  components/
    ui/         # presentational components
    containers/ # optional: smart components if not in screens
  hooks/        # reusable hooks
  lib/
  trpc/         # trpc client setup + providers
  api/          # API helpers if needed (rare with tRPC)
  domain/       # UI-specific domain mapping (not shared contract)
  styles/
```

**Expo app (apps/mobile)**

```
src/
  screens/      # container screens
  components/
    ui/         # presentational components
  hooks/
  lib/
  trpc/
  navigation/
  domain/
```

### SOLID rules for Frontend

#### Single Responsibility

- Screens orchestrate data + user actions
- Presentational components render only

#### Open/Closed

- Extend UI via new presentational components
- Avoid large "mega components" that keep growing

#### Interface Segregation

- Keep component props small and specific

**Prefer:**

```tsx
<ProCard pro={...} onSelect={...} />
```

instead of passing 20 unrelated props

#### Dependency Inversion

- UI depends on abstractions (hooks/services), not direct API calls everywhere
- Prefer usecases/hooks for operations used in multiple screens

### UI ↔ Domain boundaries (important)

- Zod schemas and canonical domain types live in `packages/domain`
- Frontends should not duplicate validation rules
- Frontends can define UI-only view models (e.g., formatting, grouping), but should not redefine the core contract.

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
- Don't mix API calls into presentational components
- Don't create shared UI abstractions too early
- Don't create "god services" that own everything
- Don't duplicate domain schemas on the frontend
