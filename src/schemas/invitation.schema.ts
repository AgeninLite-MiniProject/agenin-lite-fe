import {z} from "zod"

export const sendInvitationSchema = z.object({
    phoneNumber: z
    .string()
    .min(1, "Nomor telepon wajib diisi."),
});

export type SendInvitationFormValues = z.infer<typeof sendInvitationSchema>;

export const SentInvitationItemSchema = z.object({
    inviterId: z.string(),
    inviteeId: z.string(),
    inviteeName: z.string(),
    inviteePhone: z.string(),
    status: z.string(),
    createdAt: z.string(),
    respondedAt: z.string().nullable(),
});
export type SentInvitationItem = z.infer<typeof SentInvitationItemSchema>;

export const SentInvitationListResponseSchema = z.object({
    invitations: z.array(SentInvitationItemSchema),
    pendingCount: z.number().int().min(0),
    pendingCap: z.number().int().min(1),
});
export type SentInvitationListResponse = z.infer<typeof SentInvitationListResponseSchema>

export const SendInvitationResponseSchema  = z.object({
    inviterId: z.string(),
  inviteeId: z.string(),
  inviteeName: z.string(),
  status: z.string(),
  // BE DTO is LocalDateTime which serialises to null when the service
  // doesn't set it on the response. Match that contract.
  createdAt: z.string().nullable(),
  message: z.string(),
});
export type SendInvitationResponse = z.infer<typeof SendInvitationResponseSchema>;

export const CancelInvitationResponseSchema = z.object({
  inviterId: z.string(),
  inviteeId: z.string(),
  status: z.string(),       // "CANCELLED"
  cancelledAt: z.string().nullable(),
  message: z.string(),
});
export type CancelInvitationResponse = z.infer<typeof CancelInvitationResponseSchema>;

export const ReceivedInvitationItemSchema = z.object({
    inviterId: z.string(),
    inviterName: z.string(),
    inviterPhone: z.string(),
    inviterAvatarUrl: z.string().nullable(),
    status: z.string(),
    createdAt: z.string(),
});
export type ReceivedInvitationItem = z.infer<typeof ReceivedInvitationItemSchema>;

export const ReceivedInvitationListResponseSchema = z.object({
    invitations: z.array(ReceivedInvitationItemSchema),
    pendingCount: z.number().int().min(0),
});
export type ReceivedInvitationListResponse = z.infer<typeof ReceivedInvitationListResponseSchema>;

export const AcceptInvitationResponseSchema = z.object({
    inviterId: z.string(),
    inviteeId: z.string(),
    status: z.string(),
    respondedAt: z.string().nullable(),
    referredBy: z.string(),
    cancelledCount: z.number().int().min(0),
    message: z.string(),
});
export type AcceptInvitationResponse = z.infer<typeof AcceptInvitationResponseSchema>;

export const DeclineInvitationResponseSchema = z.object({
    inviterId: z.string(),
    inviteeId: z.string(),
    status: z.string(),
    respondedAt: z.string().nullable(),
    message: z.string(),
});
export type DeclineInvitationResponse = z.infer<typeof DeclineInvitationResponseSchema>;