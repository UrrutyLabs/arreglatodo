import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { supabase } from "@/lib/supabase/client";

const getBaseUrl = () => {
  // Always use the full API URL, even in browser
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  return "http://localhost:3002"; // API server port
};

export function createTRPCLinks() {
  return [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers: async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        return headers;
      },
    }),
  ];
}
