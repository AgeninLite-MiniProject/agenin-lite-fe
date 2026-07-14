import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "@/lib/api/invitation.api";
import { sentInvitationsQueryKey } from "./useSentInvitations";
import type { SendInvitationFormValues } from "@/schemas/invitation.schema";
import toast from "react-hot-toast";

function translateSendError(err: any): string {
  const data = err?.response?.data ?? {};
  const message: string = data.message ?? "";

  const code: string | undefined =
    data.error_code ??
    data.errorCode ??
    data.code ??
    (message.includes(":") ? message.split(":")[0].trim() : undefined);

  switch (code) {
    case "INV_0001":
      return "Tidak dapat mengundang diri sendiri.";
    case "INV_0002":
      return "Tidak dapat membuat siklus pada hierarki jaringan.";
    case "INV_0003":
      return "Undangan untuk nomor ini sudah ada dan masih menunggu.";
    case "INV_0004":
      return "Orang ini sudah memiliki upline.";
    case "INV_0005":
      return "Kamu sudah punya 3 undangan menunggu.";
    case "INV_0022":
      return "Format nomor telepon tidak valid.";
    case "INV_0023":
      return "Nomor telepon belum terdaftar di AgeninLite.";
    default:
      return message || "Gagal mengirim undangan. Coba lagi.";
  }
}

function getErrorCode(err: any): string | undefined {
  const data = err?.response?.data ?? {};
  const message: string = data.message ?? "";
  return (
    data.error_code ??
    data.errorCode ??
    data.code ??
    (message.includes(":") ? message.split(":")[0].trim() : undefined)
  );
}

export function useSendInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendInvitationFormValues) =>
      invitationApi.send(payload),

    onSuccess: (response) => {
      toast.success(`Undangan terkirim ke ${response.inviteeName}.`);
      queryClient.invalidateQueries({ queryKey: sentInvitationsQueryKey });
    },

    onError: (err: any) => {
      toast.error(translateSendError(err));
      if (getErrorCode(err) === "INV_0005") {
        queryClient.invalidateQueries({ queryKey: sentInvitationsQueryKey });
      }
    },
  });
}
