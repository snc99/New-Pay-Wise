"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToastNotify } from "@/lib/useToastNotify";

interface Props {
  onSuccess: () => void;
}

export default function AdminForm({ onSuccess }: Props) {
  const { success, error } = useToastNotify();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "ADMIN",
  });

  // State kontrol modal buka/tutup
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menambahkan admin");

      success(`${form.name} berhasil ditambahkan`);

      setForm({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "ADMIN",
      });

      onSuccess(); // trigger fetch ulang

      setOpen(false); // Tutup modal setelah berhasil submit
    } catch (err) {
      error("Terjadi kesalahan saat menambahkan admin");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setOpen(true)}
        >
          Tambah Admin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Admin Baru</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(val) =>
                setForm({ ...form, role: val as "ADMIN" | "SUPERADMIN" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={handleSubmit}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
