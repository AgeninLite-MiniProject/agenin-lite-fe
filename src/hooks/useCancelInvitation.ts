import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "@/lib/api/invitation.api";
import { sentInvitationsQueryKey } from "./useSentInvitations";
import toast from "react-hot-toast";

export function useCancelInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteeId: string) => invitationApi.cancel(inviteeId),

    onSuccess: () => {
      toast.success("Undangan dibatalkan.");
      // The right column refetches — the row is gone, pendingCount drops.
      queryClient.invalidateQueries({ queryKey: sentInvitationsQueryKey });
    },

    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        "Gagal membatalkan undangan. Coba lagi.";
      toast.error(msg);
    },
  });
}