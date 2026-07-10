import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Nama Lengkap Wajib Diisi!" }),
    phone: z
      .string()
      .min(1, { message: "Nomor Telepon Wajib Diisi!" })
      .regex(/^\+?[1-9]\d{1,14}$/, {
        message: "Format Nomor Telepon Tidak Valid!",
      }),
    email: z
      .string()
      .email({ message: "Format Email Tidak Valid!" })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, { message: "Password Minimal 8 Karakter!" })
      .max(15, { message: "Password Maksimal 15 Karakter!" }),
    confirm_password: z
      .string()
      .min(1, { message: "Konfirmasi Password Wajib Diisi!" }),
    referral_code: z.string().optional().or(z.literal("")),
  })

  .refine((data) => data.password === data.confirm_password, {
    message: "Password dan Konfirmasi Password yang Anda Masukkan Tidak Sama!",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
