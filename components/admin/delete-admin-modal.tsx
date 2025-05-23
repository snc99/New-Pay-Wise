"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Admin } from "@/types/admin";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useToastNotify } from "@/lib/useToastNotify";
import Image from "next/image";

interface DeleteAdminModalProps {
  open: boolean;
  onClose: () => void;
  admin: Admin | null;
  onDeleted: () => void;
}

export function DeleteAdminModal({
  open,
  onClose,
  admin,
  onDeleted,
}: DeleteAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const { success, error } = useToastNotify();

  const handleDelete = async () => {
    if (!admin) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/${admin.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus admin");

      success(`${admin.name} berhasil dihapus`);
      onDeleted();
      onClose();
    } catch (err) {
      error("Terjadi kesalahan saat menghapus");
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
            Yakin ingin menghapus {admin?.name}?
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center">
            {admin?.name} akan dihapus secara permanen.
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
