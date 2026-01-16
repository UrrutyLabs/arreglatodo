import { trpc } from "@/lib/trpc/client";
import type { ContactFormInput } from "@repo/domain";

/**
 * Hook to handle contact form submission
 * Encapsulates the contact.submit mutation
 */
export function useSubmitContact() {
  const submitMutation = trpc.contact.submit.useMutation();

  const handleSubmit = async (input: ContactFormInput) => {
    try {
      await submitMutation.mutateAsync(input);
      // Success - mutation's onSuccess is handled by the screen
    } catch (error) {
      // Error is handled by mutation state
      throw error;
    }
  };

  return {
    submitContact: handleSubmit,
    isPending: submitMutation.isPending,
    error: submitMutation.error,
    data: submitMutation.data,
    isSuccess: submitMutation.isSuccess,
  };
}
