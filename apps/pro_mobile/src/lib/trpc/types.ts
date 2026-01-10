/**
 * AppRouter type for type-safe tRPC calls.
 * 
 * For a standalone app, we use 'any' to allow flexible API calls.
 * The actual API endpoints must exist on your backend server.
 * 
 * In a real app with a shared monorepo, you would import the actual
 * AppRouter type from your backend package.
 */
export type AppRouter = any;
