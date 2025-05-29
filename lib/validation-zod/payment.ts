import { z } from "zod";

export const paymentSchema = z.object({
  debtId: z.string().min(1, "ID utang wajib diisi"),
  amount: z.number().positive("Nominal pembayaran harus lebih dari 0"),
  paidAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal pembayaran tidak valid",
  }),
});

export type PaymentInput = z.infer<typeof paymentSchema>;
