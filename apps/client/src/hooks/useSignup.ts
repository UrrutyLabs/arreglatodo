import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import type { ClientSignupInput } from "@repo/domain";

/**
 * Hook to handle user signup
 * Encapsulates the auth.signup mutation and handles navigation to confirmation screen
 */
export function useSignup() {
  const router = useRouter();

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: (data) => {
      // Redirect to email confirmation screen
      router.push(`/confirm-email?email=${encodeURIComponent(data.email)}`);
    },
  });

  const handleSignup = async (input: ClientSignupInput) => {
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
