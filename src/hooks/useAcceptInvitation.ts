import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "@/lib/api/invitation.api";
import { receivedInvitationsQueryKey } from "./useReceivedInvitations";
import type { AcceptInvitationResponse } from "@/schemas/invitation.schema";
import toast from "react-hot-toast";

function translateAcceptError(err: any): string {
  const data = err?.response?.data ?? {};
  const message: string = data.message ?? "";

  const code: string | undefined =
    data.error_code ??
    data.errorCode ??
    data.code ??
    (message.includes(":") ? message.split(":")[0].trim() : undefined);

  switch (code) {
    case "INV_0010":
      return "Pengundang sudah memiliki 10 downline. Tidak bisa menerima.";
    case "INV_0011":
      return "Undangan ini sudah tidak menunggu (mungkin sudah direspon di tempat lain).";
    case "INV_0012":
      return "Anda sudah memiliki upline. Tidak bisa menerima undangan lain.";
    case "INV_0013":
      return "Undangan tidak ditemukan.";
    default:
      return message || "Gagal menerima undangan. Coba lagi.";
  }
}

function getErrorCode(err: any): string | undefined {
  // Shared helper, identical to the one in useSendInvitation.ts.
  const data = err?.response?.data ?? {};
  const message: string = data.message ?? "";
  return (
    data.error_code ??
    data.errorCode ??
    data.code ??
    (message.includes(":") ? message.split(":")[0].trim() : undefined)
  );
}

export function useAcceptInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviterId: string): Promise<AcceptInvitationResponse> =>
      invitationApi.accept(inviterId),

    onSuccess: () => {
      toast.success("Undangan diterima.");
      queryClient.invalidateQueries({ queryKey: receivedInvitationsQueryKey });
    },

    onError: (err: any) => {
      toast.error(translateAcceptError(err));
      const code = getErrorCode(err);
      if (code === "INV_0011" || code === "INV_0012") {
        queryClient.invalidateQueries({ queryKey: receivedInvitationsQueryKey });
      }
    },
  });
}
