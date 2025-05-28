import { z } from "zod";

export const debtSchema = z.object({
  userId: z.string().min(1, "User ID wajib diisi"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Jumlah utang harus berupa angka lebih dari 0",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }),
});

export type DebtInput = z.infer<typeof debtSchema>;
