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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Hapus Admin
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus{" "}
            <span className="font-semibold text-foreground">{admin?.name}</span>
            ? Aksi ini tidak dapat dibatalkan.
          </p>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
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
