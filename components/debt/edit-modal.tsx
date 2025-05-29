"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToastNotify } from "@/lib/useToastNotify";

interface Debt {
  id: string;
  userId: string;
  amount: number | string; // bisa string dari input, nanti convert saat submit
  date: string; // ISO string
  createdAt: string;
  updatedAt: string;
}

interface ModalEditDebtProps {
  open: boolean;
  onClose: () => void;
  debt: Debt | null;
  onUpdated: () => void;
}

export default function ModalEditDebt({
  open,
  onClose,
  debt,
  onUpdated,
}: ModalEditDebtProps) {
  const [amount, setAmount] = useState(debt?.amount.toString() || "");
  const [date, setDate] = useState(debt?.date.slice(0, 10) || ""); // format yyyy-mm-dd untuk input type=date
  const [loading, setLoading] = useState(false);
  const { success, error } = useToastNotify();

  useEffect(() => {
    if (debt) {
      setAmount(debt.amount.toString());
      setDate(debt.date.slice(0, 10));
    }
  }, [debt]);

  const handleUpdate = async () => {
    if (!debt) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/debt/${debt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          date,
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui hutang");

      success(`Hutang berhasil diperbarui`);
      onUpdated();
      onClose();
    } catch (err) {
      error("Terjadi kesalahan saat memperbarui hutang");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Hutang</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Jumlah Hutang</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              placeholder="Masukkan jumlah hutang"
            />
          </div>

          <div>
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
