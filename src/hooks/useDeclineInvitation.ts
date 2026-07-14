import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "@/lib/api/invitation.api";
import { receivedInvitationsQueryKey } from "./useReceivedInvitations";
import type { DeclineInvitationResponse } from "@/schemas/invitation.schema";
import toast from "react-hot-toast";

function translateDeclineError(err: any): string {
  const data = err?.response?.data ?? {};
  const message: string = data.message ?? "";

  const code: string | undefined =
    data.error_code ??
    data.errorCode ??
    data.code ??
    (message.includes(":") ? message.split(":")[0].trim() : undefined);

  switch (code) {
    case "INV_0014":
      return "Undangan tidak ditemukan.";
    default:
      return message || "Gagal menolak undangan. Coba lagi.";
  }
}

export function useDeclineInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviterId: string): Promise<DeclineInvitationResponse> =>
      invitationApi.decline(inviterId),

    onSuccess: () => {
      toast.success("Undangan ditolak.");
      // Same invalidation as accept — the row should disappear.
      queryClient.invalidateQueries({ queryKey: receivedInvitationsQueryKey });
    },

    onError: (err: any) => {
      toast.error(translateDeclineError(err));
    },
  });
}