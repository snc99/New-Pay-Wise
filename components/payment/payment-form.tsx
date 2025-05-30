"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToastNotify } from "@/lib/useToastNotify";
import { z } from "zod";
import { FiPlusCircle } from "react-icons/fi";

const paymentSchema = z.object({
  debtId: z.string().min(1, "Pilih utang terlebih dahulu"),
  amount: z
    .string()
    .regex(/^\d+$/, "Jumlah harus berupa angka")
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Jumlah harus lebih besar dari 0"),
  paidAt: z.string().min(1, "Tanggal pembayaran harus diisi"),
});

const initialForm = {
  debtId: "",
  amount: "",
  paidAt: "",
};

export default function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const { success, error } = useToastNotify();

  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof initialForm, string>>
  >({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debts, setDebts] = useState<
    { id: string; userName: string; remainingDebt: number }[]
  >([]);

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  useEffect(() => {
    // Fetch only when modal dibuka
    if (open) {
      fetch("/api/debt/select-payment")
        .then((res) => res.json())
        .then((data) => setDebts(data))
        .catch(() => error("Gagal memuat data utang"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const resetForm = () => {
    setForm(initialForm);
    setFormErrors({});
    setIsLoading(false);
    setDebts([]);
  };

  const handleInputChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [field]: e.target.value });
      if (formErrors[field]) {
        setFormErrors({ ...formErrors, [field]: undefined });
      }
    };

  const handleSubmit = async () => {
    setFormErrors({});
    const validation = paymentSchema.safeParse(form);

    if (!validation.success) {
      const errors: Partial<Record<keyof typeof form, string>> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof form;
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!res.ok) {
        const result = await res.json();
        if (result?.field) {
          setFormErrors({ [result.field]: result.message });
        } else {
          throw new Error(result?.message || "Gagal menambahkan pembayaran");
        }
        setIsLoading(false);
        return;
      }

      await res.json();
      const user = debts.find((d) => d.id === form.debtId)?.userName || "";
      success(`Pembayaran berhasil ditambahkan untuk ${user}`);
      onSuccess();
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message);
      } else {
        error("Terjadi kesalahan saat menambahkan pembayaran");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md">
          <FiPlusCircle className="mr-2 h-4 w-4" />
          Tambah Pembayaran
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tambah Pembayaran
          </DialogTitle>
        </DialogHeader>

        <form
          className="grid gap-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Debt selection */}
          <div className="space-y-2">
            <Label htmlFor="debtId" className="text-gray-700 font-medium">
              Pilih Utang
            </Label>
            <select
              id="debtId"
              value={form.debtId}
              onChange={handleInputChange("debtId")}
              className={`w-full rounded-md border px-3 py-2 ${
                formErrors.debtId ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            >
              <option value="">-- Pilih Utang --</option>
              {debts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.userName} - Sisa Rp {d.remainingDebt.toLocaleString()}
                </option>
              ))}
            </select>
            {formErrors.debtId && (
              <p className="text-sm text-red-500 mt-1">{formErrors.debtId}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 font-medium">
              Jumlah Pembayaran (Rp)
            </Label>
            <Input
              id="amount"
              value={form.amount}
              onChange={handleInputChange("amount")}
              className={`${formErrors.amount ? "border-red-500" : ""}`}
              placeholder="Masukkan jumlah pembayaran"
              disabled={isLoading}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {formErrors.amount && (
              <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="paidAt" className="text-gray-700 font-medium">
              Tanggal Pembayaran
            </Label>
            <Input
              id="paidAt"
              type="date"
              value={form.paidAt}
              onChange={handleInputChange("paidAt")}
              className={`${formErrors.paidAt ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {formErrors.paidAt && (
              <p className="text-sm text-red-500 mt-1">{formErrors.paidAt}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Pembayaran"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
