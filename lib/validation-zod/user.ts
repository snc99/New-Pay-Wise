import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .nonempty("Nama wajib diisi") // wajib isi
    .min(3, "Nama minimal 3 karakter"), // minimal 3 karakter
  phone: z
    .string()
    .nonempty("Nomor telepon wajib diisi") // wajib isi
    .min(8, "Nomor telepon minimal 8 digit") // minimal 8 digit
    .max(13, "Nomor telepon maksimal 13 digit") // maksimal 13 digit
    .regex(/^\d+$/, "Nomor telepon harus berupa angka"), // hanya angka
  address: z
    .string()
    .nonempty("Alamat wajib diisi") // wajib isi
    .min(5, "Alamat minimal 5 karakter"), // minimal 5 karakter
});
