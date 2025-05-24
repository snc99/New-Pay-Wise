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
import { useToastNotify } from "@/lib/useToastNotify";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUpdated: () => void;
}

export default function EditModal({
  open,
  onClose,
  user,
  onUpdated,
}: EditModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const { success, error } = useToastNotify();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, address }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui user");

      success(`${name} berhasil diperbarui`);
      onUpdated();
    } catch (err) {
      error("Terjadi kesalahan saat memperbarui");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nama</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Telepon</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <Label>Alamat</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
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
