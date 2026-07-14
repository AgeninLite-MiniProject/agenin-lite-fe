import { useQuery } from "@tanstack/react-query";
import { invitationApi } from "@/lib/api/invitation.api";

export const sentInvitationsQueryKey = ["sent-invitations", "PENDING"] as const;

export function useSentPendingInvitationsQuery() {
  return useQuery({
    queryKey: sentInvitationsQueryKey,
    queryFn: () => invitationApi.listSentPending(),
    staleTime: 30_000,
  });
}
