apps/mobile/src/
  app/                         # if using Expo Router (recommended)
    _layout.tsx
    index.tsx                  # redirects based on auth -> /(tabs)/home or /auth/login
    auth/
      login.tsx
      signup.tsx
    (tabs)/
      home.tsx                 # Jobs inbox
      jobs.tsx                 # My jobs list
      availability.tsx         # Availability
    booking/
      [bookingId].tsx          # Job detail

  screens/                     # Containers (smart)
    auth/
      LoginScreen.tsx
      SignupScreen.tsx
    home/
      HomeScreen.tsx
    jobs/
      JobsScreen.tsx
    booking/
      BookingDetailScreen.tsx
    availability/
      AvailabilityScreen.tsx

  components/
    ui/                        # primitives (Button/Text/Card/Input/Badge)
      Button.tsx
      Text.tsx
      Card.tsx
      Input.tsx
      Badge.tsx
    presentational/            # UI-only
      BookingCard.tsx
      StatusPill.tsx
      SectionHeader.tsx
      EmptyState.tsx

  hooks/                       # smart hooks
    useAuth.ts
    useMyJobs.ts
    useBooking.ts
    useBookingActions.ts
    useAvailability.ts

  lib/
    supabase/
      client.ts                # Expo supabase client
    trpc/
      client.ts
      Provider.tsx
      links.ts                 # attaches Authorization Bearer token

  theme/
    index.ts                   # imports @acme/ui tokens, exports theme
