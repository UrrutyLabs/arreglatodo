# ProProfileScreen Refactor - Phased Implementation Plan

## Overview

Refactor `ProProfileScreen` into a two-column layout with scrollable profile content on the left and a fixed request form sidebar on the right.

## Requirements Summary

- ✅ Modify API to include client name + first letter of surname in reviews
- ✅ Show categories as chips (not subcategories)
- ⏭️ Ignore breadcrumbs for now

---

## Phase 1: API Changes - Add Client Name to Reviews

### 1.1 Update Review Domain Schema

**File:** `packages/domain/src/schemas/review.schema.ts`

- Add optional `clientDisplayName?: string` field to `reviewSchema`
- Format: "FirstName L." (first letter of surname)
- Keep backward compatibility (optional field)

### 1.2 Update Review Service

**File:** `apps/api/src/server/modules/review/review.service.ts`

- Inject `ClientProfileService` via dependency injection
- Modify `listForPro()` method:
  - Fetch client profiles for all `clientUserId`s in batch
  - Format client name as: `${firstName} ${lastName?.[0] ?? ''}.` (e.g., "Juan P.")
  - Include `clientDisplayName` in returned review objects
- Handle cases where client profile doesn't exist (use fallback or null)

### 1.3 Update Review Repository (if needed)

**File:** `apps/api/src/server/modules/review/review.repo.ts`

- No changes needed (already returns `clientUserId`)

### 1.4 Update Container Registration

**File:** `apps/api/src/server/container/modules/review.module.ts`

- Ensure `ClientProfileService` is available for injection in `ReviewService`

### 1.5 Testing

- Update `review.service.test.ts` to test client name formatting
- Test edge cases: missing firstName, missing lastName, missing profile

---

## Phase 2: Create Hooks

### 2.1 Create Review Hook

**File:** `apps/client/src/hooks/review/useProReviews.ts` (new)

- Use `trpc.review.listForPro.useInfiniteQuery` for pagination
- Return: `{ reviews, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage }`
- Handle cursor-based pagination

### 2.2 Create Review Hook Index

**File:** `apps/client/src/hooks/review/index.ts` (new)

- Export `useProReviews`

---

## Phase 3: Create Presentational Components

### 3.1 Pro Profile Header Component

**File:** `apps/client/src/components/pro/ProProfileHeader.tsx` (new)

- **Props:** `{ name: string; avatarUrl?: string; rating?: number; reviewCount: number }`
- **Layout:** Single column with:
  - Avatar (circular, with fallback)
  - Name (h1)
  - Rating stars + review count
- **Styling:** Use existing UI components (`Text`, `Card` if needed)

### 3.2 Pro Bio Component

**File:** `apps/client/src/components/pro/ProBio.tsx` (new)

- **Props:** `{ bio?: string }`
- **Layout:** Simple text display with section header
- **Fallback:** Show placeholder text if no bio

### 3.3 Pro Overview Component

**File:** `apps/client/src/components/pro/ProOverview.tsx` (new)

- **Props:** `{ completedJobsCount: number; serviceArea?: string }`
- **Layout:**
  - Completed jobs count
  - Location (serviceArea) with icon
- **Styling:** Use icons from `lucide-react`

### 3.4 Pro Availability Component

**File:** `apps/client/src/components/pro/ProAvailability.tsx` (new)

- **Props:** `{ availabilitySlots: AvailabilitySlot[] }`
- **Layout:** List format showing:
  - Day name (e.g., "Lunes")
  - Start time - End time (e.g., "09:00 - 17:00")
- **Formatting:** Convert `dayOfWeek` (0-6) to Spanish day names
- **Empty state:** Show message if no availability slots

### 3.5 Pro Services Offered Component

**File:** `apps/client/src/components/pro/ProServicesOffered.tsx` (new)

- **Props:** `{ categories: Category[] }`
- **Layout:** Category chips/badges
- **Styling:** Use `Badge` component from `@repo/ui`

### 3.6 Pro Reviews Component

**File:** `apps/client/src/components/pro/ProReviews.tsx` (new)

- **Props:** `{ proId: string; rating?: number; reviewCount: number }`
- **Responsibilities:**
  - Fetch reviews using `useProReviews` hook
  - Display rating summary (stars + count)
  - Render paginated list of `ReviewComment` components
  - Handle "Load More" button for pagination
  - Show loading/empty states

### 3.7 Review Comment Component

**File:** `apps/client/src/components/pro/ReviewComment.tsx` (new)

- **Props:** `{ review: Review & { clientDisplayName?: string } }`
- **Layout:**
  - Top row: Commenter name | "X days ago" (right-aligned)
  - Middle: Star rating display
  - Bottom: Comment text
- **Date formatting:** Use utility to format "X days ago" (or create one)

### 3.8 Pro Request Form Component

**File:** `apps/client/src/components/pro/ProRequestForm.tsx` (new)

- **Props:** `{ hourlyRate: number; proId: string; onContratar: () => void; disabled?: boolean }`
- **Layout:** Fixed sidebar with:
  - Rate/hour display (top)
  - "Contratar" button (bottom)
- **Styling:** Use `Card` component, fixed positioning
- **Responsive:** Hide on mobile, show on desktop (lg+)

### 3.9 Create Components Index

**File:** `apps/client/src/components/pro/index.ts` (update)

- Export all new components

---

## Phase 4: Refactor ProProfileScreen

### 4.1 Update Screen Layout

**File:** `apps/client/src/screens/pro/ProProfileScreen.tsx`

- **Layout Structure:**
  ```tsx
  <div className="min-h-screen bg-bg">
    <Navigation ... />
    <div className="px-4 py-4 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Scrollable Profile (2 columns on lg+) */}
          <div className="lg:col-span-2 space-y-6">
            {/* All profile sections */}
          </div>

          {/* Right: Fixed Request Form (1 column on lg+) */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              <ProRequestForm ... />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ```

### 4.2 Data Fetching

- Keep existing `useProDetail` hook
- Add `useProReviews` hook for reviews
- Add `useCategories` hook (already exists) to get category names for chips
- Map `pro.categoryIds` to `Category[]` objects

### 4.3 Component Integration

- Replace existing sections with new components:
  - ProProfileHeader (avatar, name, rating, review count)
  - ProBio
  - ProOverview
  - ProAvailability
  - ProServicesOffered (categories as chips)
  - ProReviews
- Keep `ProRequestForm` in fixed sidebar

### 4.4 Remove Old Code

- Remove inline JSX for profile sections
- Remove unused imports
- Keep error/loading states at screen level

### 4.5 Responsive Behavior

- Mobile/Tablet: Single column, request form below profile (or hidden)
- Desktop (lg+): Two-column layout with fixed sidebar

---

## Phase 5: Utilities & Polish

### 5.1 Date Formatting Utility

**File:** `apps/client/src/utils/date.ts` (create or update)

- Add `formatDaysAgo(date: Date): string` function
- Returns: "Hace X días" or "Hoy" or "Ayer"

### 5.2 Day Name Utility

**File:** `apps/client/src/utils/date.ts` (or create `availability.ts`)

- Add `getDayName(dayOfWeek: number): string` function
- Maps 0-6 to Spanish day names: "Domingo", "Lunes", etc.

### 5.3 Avatar Fallback

- Ensure `ProProfileHeader` handles missing `avatarUrl`
- Use initials or default avatar icon

---

## Phase 6: Testing & Edge Cases

### 6.1 Test Components

- Test each component with various prop combinations
- Test empty states (no bio, no reviews, no availability)
- Test loading states

### 6.2 Test Screen

- Test with missing data
- Test pagination
- Test responsive layout

### 6.3 Edge Cases

- Pro with no reviews
- Pro with no availability slots
- Pro with no bio
- Pro with no categories
- Very long bio text
- Very long review comments

---

## File Structure Summary

```
apps/client/src/
  components/
    pro/
      ProProfileHeader.tsx (new)
      ProBio.tsx (new)
      ProOverview.tsx (new)
      ProAvailability.tsx (new)
      ProServicesOffered.tsx (new)
      ProReviews.tsx (new)
      ReviewComment.tsx (new)
      ProRequestForm.tsx (new)
      index.ts (update)
  hooks/
    review/
      useProReviews.ts (new)
      index.ts (new)
  screens/
    pro/
      ProProfileScreen.tsx (refactor)
  utils/
    date.ts (create or update)

apps/api/src/server/modules/review/
  review.service.ts (modify)
  review.repo.ts (no changes)
  __tests__/review.service.test.ts (update)

packages/domain/src/schemas/
  review.schema.ts (update)

apps/api/src/server/container/modules/
  review.module.ts (verify ClientProfileService injection)
```

---

## Implementation Order

1. **Phase 1** - API Changes (backend first)
2. **Phase 2** - Hooks (frontend data layer)
3. **Phase 3** - Components (UI building blocks)
4. **Phase 4** - Screen Refactor (integration)
5. **Phase 5** - Utilities (polish)
6. **Phase 6** - Testing (validation)

---

## Notes

- All components follow FE_BEST_PRACTICES.md (presentational, props-based)
- Use existing UI library components (`Text`, `Card`, `Button`, `Badge`)
- Maintain TypeScript type safety throughout
- Follow existing code patterns and conventions
- Ensure responsive design (mobile-first approach)
