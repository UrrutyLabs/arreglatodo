# Hooks Folder Organization Proposal

## Current State

**Total Hooks: 13 files**

### Current Structure
```
src/hooks/
├── useAppState.ts              # Infrastructure
├── useAuth.ts                  # Auth
├── useAvailability.ts          # Pro/Profile
├── useBookingActions.ts        # Booking
├── useBookingDetail.ts         # Booking
├── useNetworkStatus.ts         # Infrastructure
├── useOnboarding.ts            # Auth/Onboarding
├── useProInbox.ts              # Booking
├── useProJobs.ts               # Booking
├── useProSignup.ts             # Auth
├── usePushToken.ts             # Infrastructure/Notifications
├── useQueryClient.ts           # Infrastructure/React Query
└── useSmartPolling.ts          # Infrastructure/React Query
```

### Categorization by Domain

**Auth Domain (3 hooks):**
- `useAuth` - Core authentication
- `useProSignup` - Pro signup flow
- `useOnboarding` - Onboarding flow

**Booking Domain (4 hooks):**
- `useBookingDetail` - Fetch booking by ID
- `useBookingActions` - Booking mutations (accept, reject, etc.)
- `useProInbox` - Pro inbox bookings (pending/accepted)
- `useProJobs` - Pro jobs (accepted/arrived/completed)

**Pro/Profile Domain (1 hook):**
- `useAvailability` - Pro availability toggle

**Infrastructure/Utilities (5 hooks):**
- `useAppState` - App foreground/background state
- `useNetworkStatus` - Network connectivity
- `usePushToken` - Push notification token management
- `useQueryClient` - React Query client access
- `useSmartPolling` - Smart polling configuration

---

## Organization Options

### Option 1: By Feature/Domain (Recommended) ⭐

**Structure:**
```
src/hooks/
├── auth/
│   ├── useAuth.ts
│   ├── useProSignup.ts
│   └── useOnboarding.ts
├── booking/
│   ├── useBookingDetail.ts
│   ├── useBookingActions.ts
│   ├── useProInbox.ts
│   └── useProJobs.ts
├── pro/
│   └── useAvailability.ts
└── shared/
    ├── useAppState.ts
    ├── useNetworkStatus.ts
    ├── usePushToken.ts
    ├── useQueryClient.ts
    └── useSmartPolling.ts
```

**Pros:**
- ✅ Clear domain boundaries
- ✅ Easy to find hooks by feature
- ✅ Scales well as features grow
- ✅ Matches common React patterns (feature-based organization)
- ✅ Shared utilities are clearly separated
- ✅ Easy to add new hooks to the right domain

**Cons:**
- ⚠️ Requires updating imports (but can use index.ts files to maintain backward compatibility)
- ⚠️ Slightly deeper import paths

**Import Changes:**
```typescript
// Before
import { useAuth } from "../../hooks/useAuth";
import { useBookingDetail } from "../../hooks/useBookingDetail";

// After (with index.ts)
import { useAuth } from "../../hooks/auth";
import { useBookingDetail } from "../../hooks/booking";

// Or direct (without index.ts)
import { useAuth } from "../../hooks/auth/useAuth";
import { useBookingDetail } from "../../hooks/booking/useBookingDetail";
```

**Migration Strategy:**
1. Create new folder structure
2. Move files to appropriate folders
3. Create `index.ts` files in each folder for clean exports
4. Update imports gradually (or all at once)
5. Remove old files

---

### Option 2: By Screen/Route

**Structure:**
```
src/hooks/
├── auth/
│   ├── useAuth.ts
│   ├── useProSignup.ts
│   └── useOnboarding.ts
├── home/
│   └── useProInbox.ts
├── jobs/
│   └── useProJobs.ts
├── booking/
│   ├── useBookingDetail.ts
│   └── useBookingActions.ts
├── settings/
│   └── useAvailability.ts
└── shared/
    ├── useAppState.ts
    ├── useNetworkStatus.ts
    ├── usePushToken.ts
    ├── useQueryClient.ts
    └── useSmartPolling.ts
```

**Pros:**
- ✅ Hooks are grouped by where they're used
- ✅ Easy to find hooks for a specific screen

**Cons:**
- ❌ Hooks can be used across multiple screens (e.g., `useBookingDetail` used in both `HomeScreen` and `BookingDetailScreen`)
- ❌ Doesn't scale well - hooks often serve multiple screens
- ❌ Breaks domain boundaries (booking hooks split across folders)
- ❌ Harder to maintain when hooks are reused

**Verdict:** ❌ Not recommended - too rigid, doesn't match how hooks are actually used

---

### Option 3: Flat with Prefixes

**Structure:**
```
src/hooks/
├── auth.useAuth.ts
├── auth.useProSignup.ts
├── auth.useOnboarding.ts
├── booking.useBookingDetail.ts
├── booking.useBookingActions.ts
├── booking.useProInbox.ts
├── booking.useProJobs.ts
├── pro.useAvailability.ts
├── shared.useAppState.ts
├── shared.useNetworkStatus.ts
├── shared.usePushToken.ts
├── shared.useQueryClient.ts
└── shared.useSmartPolling.ts
```

**Pros:**
- ✅ No folder structure to navigate
- ✅ Easy to see domain from filename
- ✅ No import path changes needed (just rename files)

**Cons:**
- ❌ Still a flat structure (13 files in one folder)
- ❌ Less organized visually
- ❌ Doesn't scale well (will still get cluttered)
- ❌ Unconventional naming pattern

**Verdict:** ❌ Not recommended - doesn't solve the core problem of organization

---

### Option 4: Hybrid - Feature Folders + Shared

**Structure:**
```
src/hooks/
├── auth/
│   ├── index.ts              # Re-exports all auth hooks
│   ├── useAuth.ts
│   ├── useProSignup.ts
│   └── useOnboarding.ts
├── booking/
│   ├── index.ts               # Re-exports all booking hooks
│   ├── useBookingDetail.ts
│   ├── useBookingActions.ts
│   ├── useProInbox.ts
│   └── useProJobs.ts
├── pro/
│   ├── index.ts               # Re-exports pro hooks
│   └── useAvailability.ts
└── shared/
    ├── index.ts                # Re-exports shared utilities
    ├── useAppState.ts
    ├── useNetworkStatus.ts
    ├── usePushToken.ts
    ├── useQueryClient.ts
    └── useSmartPolling.ts
```

**With index.ts files for clean imports:**
```typescript
// hooks/auth/index.ts
export { useAuth } from "./useAuth";
export { useProSignup } from "./useProSignup";
export { useOnboarding } from "./useOnboarding";

// hooks/booking/index.ts
export { useBookingDetail } from "./useBookingDetail";
export { useBookingActions } from "./useBookingActions";
export { useProInbox } from "./useProInbox";
export { useProJobs } from "./useProJobs";

// hooks/pro/index.ts
export { useAvailability } from "./useAvailability";

// hooks/shared/index.ts
export { useAppState } from "./useAppState";
export { useNetworkStatus } from "./useNetworkStatus";
export { usePushToken } from "./usePushToken";
export { useQueryClient } from "./useQueryClient";
export { useSmartPolling } from "./useSmartPolling";
```

**Pros:**
- ✅ Same as Option 1, but with index.ts files
- ✅ Clean imports: `import { useAuth, useProSignup } from "../../hooks/auth"`
- ✅ Maintains backward compatibility if needed
- ✅ Easy to add new hooks
- ✅ Clear domain boundaries
- ✅ Scales well

**Cons:**
- ⚠️ Requires updating imports (but cleaner with index.ts)
- ⚠️ Need to maintain index.ts files

**Verdict:** ⭐⭐⭐⭐⭐ **BEST OPTION** - Combines organization with clean imports

---

### Option 5: By Type (Queries vs Mutations vs Utilities)

**Structure:**
```
src/hooks/
├── queries/
│   ├── useBookingDetail.ts
│   ├── useProInbox.ts
│   └── useProJobs.ts
├── mutations/
│   ├── useBookingActions.ts
│   ├── useAvailability.ts
│   ├── useProSignup.ts
│   └── useOnboarding.ts
├── auth/
│   └── useAuth.ts
└── utilities/
    ├── useAppState.ts
    ├── useNetworkStatus.ts
    ├── usePushToken.ts
    ├── useQueryClient.ts
    └── useSmartPolling.ts
```

**Pros:**
- ✅ Separates read vs write operations
- ✅ Clear separation of concerns

**Cons:**
- ❌ Some hooks mix queries and mutations (e.g., `useAvailability`)
- ❌ Doesn't group related functionality together
- ❌ Harder to find hooks by feature
- ❌ Less intuitive for developers

**Verdict:** ❌ Not recommended - too technical, doesn't match mental model

---

## Recommendation: Option 4 (Hybrid - Feature Folders + Shared)

### Why Option 4?

1. **Domain-Driven Organization**: Groups hooks by business domain (auth, booking, pro)
2. **Clean Imports**: Index files allow `import { useAuth } from "../../hooks/auth"`
3. **Scalability**: Easy to add new hooks to the right domain
4. **Maintainability**: Clear boundaries, easy to find related hooks
5. **Industry Standard**: Matches common React/Next.js patterns

### Implementation Steps

1. **Create folder structure**
   ```
   mkdir -p src/hooks/{auth,booking,pro,shared}
   ```

2. **Move files**
   - `useAuth.ts`, `useProSignup.ts`, `useOnboarding.ts` → `hooks/auth/`
   - `useBookingDetail.ts`, `useBookingActions.ts`, `useProInbox.ts`, `useProJobs.ts` → `hooks/booking/`
   - `useAvailability.ts` → `hooks/pro/`
   - `useAppState.ts`, `useNetworkStatus.ts`, `usePushToken.ts`, `useQueryClient.ts`, `useSmartPolling.ts` → `hooks/shared/`

3. **Create index.ts files** in each folder for clean exports

4. **Update imports** across the codebase:
   ```typescript
   // Old
   import { useAuth } from "../../hooks/useAuth";
   
   // New
   import { useAuth } from "../../hooks/auth";
   ```

5. **Update internal hook imports** (e.g., `useSmartPolling` imports `useAppState`)

### Folder Structure Details

```
src/hooks/
├── auth/
│   ├── index.ts
│   ├── useAuth.ts
│   ├── useProSignup.ts
│   └── useOnboarding.ts
├── booking/
│   ├── index.ts
│   ├── useBookingDetail.ts
│   ├── useBookingActions.ts
│   ├── useProInbox.ts
│   └── useProJobs.ts
├── pro/
│   ├── index.ts
│   └── useAvailability.ts
└── shared/
    ├── index.ts
    ├── useAppState.ts
    ├── useNetworkStatus.ts
    ├── usePushToken.ts
    ├── useQueryClient.ts
    └── useSmartPolling.ts
```

### Import Examples After Migration

```typescript
// Single hook
import { useAuth } from "../../hooks/auth";
import { useBookingDetail } from "../../hooks/booking";

// Multiple hooks from same domain
import { useAuth, useProSignup } from "../../hooks/auth";
import { useBookingDetail, useBookingActions } from "../../hooks/booking";

// Shared utilities
import { useQueryClient, useSmartPolling } from "../../hooks/shared";
```

---

## Alternative: Option 1 (Simpler, No Index Files)

If you prefer simpler structure without index.ts files:

```
src/hooks/
├── auth/
│   ├── useAuth.ts
│   ├── useProSignup.ts
│   └── useOnboarding.ts
├── booking/
│   ├── useBookingDetail.ts
│   ├── useBookingActions.ts
│   ├── useProInbox.ts
│   └── useProJobs.ts
├── pro/
│   └── useAvailability.ts
└── shared/
    ├── useAppState.ts
    ├── useNetworkStatus.ts
    ├── usePushToken.ts
    ├── useQueryClient.ts
    └── useSmartPolling.ts
```

**Imports:**
```typescript
import { useAuth } from "../../hooks/auth/useAuth";
import { useBookingDetail } from "../../hooks/booking/useBookingDetail";
```

**Pros:** Simpler, no index.ts maintenance  
**Cons:** Longer import paths

---

## Summary

| Option | Organization | Scalability | Import Clarity | Recommendation |
|--------|-------------|-------------|----------------|----------------|
| **Option 1** | By Feature | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Option 2** | By Screen | ⭐⭐ | ⭐⭐⭐ | ❌ |
| **Option 3** | Flat + Prefix | ⭐⭐ | ⭐⭐⭐ | ❌ |
| **Option 4** | Feature + Index | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ **BEST** |
| **Option 5** | By Type | ⭐⭐⭐ | ⭐⭐ | ❌ |

**Final Recommendation: Option 4 (Feature Folders + Index Files)**

This provides the best balance of organization, scalability, and developer experience.
