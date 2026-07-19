import apiClient from "../axios";
import {
  SentInvitationListResponseSchema,
  SendInvitationResponseSchema,
  CancelInvitationResponseSchema,
  ReceivedInvitationListResponseSchema,
  AcceptInvitationResponseSchema,
  DeclineInvitationResponseSchema,
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

  listReceivedPending: async () => {
    const response = await apiClient.get("/api/invitations/received", {
      params: { status: "PENDING" },
    });
    return ReceivedInvitationListResponseSchema.parse(response.data.data);
  },

  accept: async (inviterId: string) => {
    const response = await apiClient.post(
      `/api/invitations/${inviterId}/accept`,
    );
    return AcceptInvitationResponseSchema.parse(response.data.data);
  },

  decline: async (inviterId: string) => {
    const response = await apiClient.post(
      `/api/invitations/${inviterId}/decline`,
    );
    return DeclineInvitationResponseSchema.parse(response.data.data);
  },
};
