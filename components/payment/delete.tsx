"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useToastNotify } from "@/lib/useToastNotify";
import Image from "next/image";
import { Payment } from "@/types/payment";

interface PaymentWithUser extends Payment {
  debt: {
    user: {
      name: string;
    };
  };
}

interface DeletePaymentModalProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentWithUser | null;
  onDeleted: () => void;
}

export function DeletePaymentModal({
  open,
  onClose,
  payment,
  onDeleted,
}: DeletePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const { success, error } = useToastNotify();

  const handleDelete = async () => {
    if (!payment) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/payment/${payment.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus pembayaran");

      success(`Pembayaran sebesar Rp${payment.amount} berhasil dihapus`);
      onDeleted();
      onClose();
    } catch (err) {
      error("Terjadi kesalahan saat menghapus pembayaran");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] text-center px-6 py-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/delete-warning.svg"
            alt="Ilustrasi hapus"
            width={200}
            height={160}
          />
        </div>
        <DialogHeader className="space-y-1">
          <DialogTitle className="!text-center text-xl font-semibold text-gray-800">
            Yakin ingin menghapus pembayaran {payment?.debt.user.name}?
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            Data pembayaran ini akan dihapus secara permanen.
          </p>
        </DialogHeader>

        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-32"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="w-32"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
