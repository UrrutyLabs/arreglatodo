# Review Migration Instructions

## Problem
The Prisma schema has been updated to include `proProfileId` and `clientUserId` in the Review model, but the migration hasn't been applied to the database yet. This causes errors when trying to create reviews.

## Solution

You need to apply the migration to your database. Choose one of these methods:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `prisma/migrations/20260111160000_add_review_pro_and_client_fields/migration.sql`
4. Run the SQL script

### Option 2: Using psql command line

```bash
cd apps/api
psql $DATABASE_URL -f prisma/migrations/20260111160000_add_review_pro_and_client_fields/migration.sql
```

### Option 3: Using a database client

1. Connect to your PostgreSQL database
2. Open the file: `apps/api/prisma/migrations/20260111160000_add_review_pro_and_client_fields/migration.sql`
3. Execute the SQL script

## After applying the migration

Once the migration is applied, regenerate the Prisma client:

```bash
cd apps/api
pnpm db:generate
```

## Verify

After applying the migration, you can verify it worked by checking that reviews can be created without errors.
