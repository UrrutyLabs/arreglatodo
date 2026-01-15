import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import type { ProSignupInput } from "@repo/domain";

/**
 * Hook to handle pro signup
 * Encapsulates the auth.proSignup mutation and handles navigation to confirmation screen
 */
export function useProSignup() {
  const router = useRouter();

  const signupMutation = trpc.auth.proSignup.useMutation({
    onSuccess: (data) => {
      router.push(`/pro/download-app?email=${encodeURIComponent(data.email)}`);
    },
  });

  const handleSignup = async (input: ProSignupInput) => {
    try {
      await signupMutation.mutateAsync(input);
      // Success - mutation's onSuccess will handle redirect
    } catch (error) {
      // Error is handled by mutation state
      throw error;
    }
  };

  return {
    signup: handleSignup,
    isPending: signupMutation.isPending,
    error: signupMutation.error,
  };
}
