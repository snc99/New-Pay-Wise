import { z } from "zod";

export const paymentSchema = z.object({
  userId: z.string().min(1, "ID user wajib diisi"),
  amount: z
    .number({ invalid_type_error: "Jumlah harus berupa angka" })
    .int("Jumlah harus bilangan bulat")
    .positive("Jumlah harus lebih dari 0"),
  paidAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal pembayaran tidak valid",
  }),
});
