import apiClient from "../axios";
import {
  SentInvitationListResponseSchema,
  SendInvitationResponseSchema,
  CancelInvitationResponseSchema,
  type SendInvitationFormValues,
} from "@/schemas/invitation.schema";

export const invitationApi = {
  listSentPending: async () => {
    const response = await apiClient.get("/api/invitations/sent", {
      params: { status: "PENDING" },
    });
    return SentInvitationListResponseSchema.parse(response.data.data);
  },

  send: async (payload: SendInvitationFormValues) => {
    const response = await apiClient.post("/api/invitations", payload);
    return SendInvitationResponseSchema.parse(response.data.data);
  },

  cancel: async (inviteeId: string) => {
    const response = await apiClient.post(
      `/api/invitations/${inviteeId}/cancel`,
    );
    return CancelInvitationResponseSchema.parse(response.data.data);
  },
};
