// validations/adminSchema.ts
import { z } from "zod";

export const adminSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 huruf").nonempty("Nama wajib diisi"),
  email: z
    .string()
    .email("Format email tidak valid")
    .nonempty("Email wajib diisi"),
  username: z
    .string()
    .min(3, "Username minimal 3 huruf")
    .regex(/\d/, "Username harus mengandung angka")
    .nonempty("Username wajib diisi"),
  password: z
    .string()
    .min(3, "Password minimal 3 huruf")
    .regex(/\d/, "Password harus mengandung angka")
    .nonempty("Password wajib diisi"),
  role: z.enum(["ADMIN", "SUPERADMIN"]),
});
