import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Nama Lengkap Wajib Diisi!" }).max(100, "Maksimal 100 karakter!"),
    phone_number: z
      .string()
      .min(1, { message: "Nomor Telepon Wajib Diisi!" })
      .max(20, { message: "Maksimal 20 Karakter!" })
      .regex(/^\+[1-9]\d{1,14}$/, {
        message: "Format E.164 Wajib! (contoh: +628...)",
      }),
    email: z
      .string()
      .email({ message: "Format Email Tidak Valid!" })
      .max(100, { message: "Maksimal 100 Karakter!" })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, { message: "Password Minimal 8 Karakter!" })
      .max(15, { message: "Password Maksimal 15 Karakter!" }),
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
  phone_number: z
    .string()
    .min(1, { message: "Nomor Telepon Wajib Diisi!" })
    .max(20, { message: "Maksimal 20 Karakter!" })
    .regex(/^\+[1-9]\d{1,14}$/, {
      message: "Format E.164 Wajib! (contoh: +628...)",
    }),
  password: z
    .string()
    .min(1, { message: "Password Wajib Diisi!" })
    .refine((val) => val.length === 0 || val.length >= 8, { message: "Password Minimal 8 Karakter!" })
    .refine((val) => val.length <= 15, { message: "Password Maksimal 15 Karakter!" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
