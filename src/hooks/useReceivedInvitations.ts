import { useQuery } from "@tanstack/react-query";
import { invitationApi } from "@/lib/api/invitation.api";

export const receivedInvitationsQueryKey = [
  "received-invitations",
  "PENDING",
] as const;

export function useReceivedPendingInvitationsQuery() {
  return useQuery({
    queryKey: receivedInvitationsQueryKey,
    queryFn: () => invitationApi.listReceivedPending(),
    staleTime: 30_000,
  });
}
