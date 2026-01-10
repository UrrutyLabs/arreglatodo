import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { supabase } from "../supabase/client";

function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Default to localhost for development
  // For device testing, replace with your LAN IP (e.g., "http://192.168.1.100:3002")
  return "http://localhost:3002";
}

export function createTRPCLinks() {
  return [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        return headers;
      },
    }),
  ];
}
