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