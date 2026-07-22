import { INDONESIAN_MOBILE_REGEX } from "@/lib/phone";
import * as z from "zod";

const phoneNumberSchema = z
  .string()
  .min(1, { message: "Nomor Telepon Wajib Diisi!" })
  .regex(INDONESIAN_MOBILE_REGEX, { message: "Nomor harus dimulai dengan 8 dan terdiri dari 9-12 digit.", });

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Nama Lengkap Wajib Diisi!" }).max(100, "Maksimal 100 karakter!"),
    phone_number: phoneNumberSchema,
    email: z
      .string()
      .email({ message: "Format Email Tidak Valid!" })
      .max(100, { message: "Maksimal 100 Karakter!" })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, { message: "Password Minimal 8 Karakter!" })
      .max(15, { message: "Password Maksimal 15 Karakter!" })
      .regex(/[a-zA-Z]/, { message: "Password wajib mengandung minimal 1 huruf!" })
      .regex(/[0-9]/, { message: "Password wajib mengandung minimal 1 angka!" }),
    confirm_password: z
      .string()
      .min(1, { message: "Konfirmasi Password Wajib Diisi!" }),
    referral_code: z.string().max(10, "Maksimal 10 karakter!").optional().or(z.literal("")),
  })

  .refine((data) => data.password === data.confirm_password, {
    message: "Password dan Konfirmasi Password yang Anda Masukkan Tidak Sama!",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  phone_number: phoneNumberSchema,
  password: z
    .string()
    .min(1, { message: "Password Wajib Diisi!" })
    .refine((val) => val.length === 0 || val.length >= 8, { message: "Password Minimal 8 Karakter!" })
    .refine((val) => val.length <= 15, { message: "Password Maksimal 15 Karakter!" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
