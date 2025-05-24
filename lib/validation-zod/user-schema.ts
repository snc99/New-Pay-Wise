import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit"),
  address: z.string().min(1, "Alamat wajib diisi"),
});
