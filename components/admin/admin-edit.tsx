"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Admin } from "@/types/admin";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useToastNotify } from "@/lib/useToastNotify";

interface ModalEditAdminProps {
  open: boolean;
  onClose: () => void;
  admin: Admin | null;
  onUpdated: () => void;
}

export default function ModalEditAdmin({
  open,
  onClose,
  admin,
  onUpdated,
}: ModalEditAdminProps) {
  const [name, setName] = useState(admin?.name || "");
  const [username, setUsername] = useState(admin?.username || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [role, setRole] = useState<"ADMIN" | "SUPERADMIN">(
    admin?.role || "ADMIN"
  );
  const [loading, setLoading] = useState(false);
  const { success, error } = useToastNotify();

  // Perbarui state ketika admin berubah
  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setUsername(admin.username);
      setEmail(admin.email);
      setRole(admin.role);
    }
  }, [admin]);

  const handleUpdate = async () => {
    if (!admin) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/${admin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          role,
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui admin");

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
          <DialogTitle>Edit Admin</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nama</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Role</Label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "ADMIN" | "SUPERADMIN")
              }
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
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
