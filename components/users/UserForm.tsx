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
import { userSchema } from "@/lib/validation-zod/user-schema";
import { FiUserPlus } from "react-icons/fi";

interface Props {
  onSuccess: () => void;
}

const initialForm = {
  name: "",
  phone: "",
  address: "",
};

export default function UserForm({ onSuccess }: Props) {
  const { success, error } = useToastNotify();

  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof initialForm, string>>
  >({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const resetForm = () => {
    setForm(initialForm);
    setFormErrors({});
    setIsLoading(false);
  };

  const handleInputChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
      if (formErrors[field]) {
        setFormErrors({ ...formErrors, [field]: undefined });
      }
    };

  const handleSubmit = async () => {
    setFormErrors({});
    const validation = userSchema.safeParse(form);

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
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result?.message || "Gagal menambahkan user");
      }

      const result = await res.json();
      success(`${result.data?.name || "User"} berhasil ditambahkan`);
      onSuccess();
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message || "Terjadi kesalahan saat menambahkan user");
      } else {
        error("Terjadi kesalahan saat menambahkan user");
        console.error("Unknown error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md">
          <FiUserPlus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tambah User Baru
          </DialogTitle>
        </DialogHeader>

        <form
          className="grid gap-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleInputChange("name")}
              className={formErrors.name ? "border-red-500" : ""}
              placeholder="Nama lengkap"
              disabled={isLoading}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">No. Telepon</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={handleInputChange("phone")}
              className={formErrors.phone ? "border-red-500" : ""}
              placeholder="08xxxxxxxxxx"
              disabled={isLoading}
            />
            {formErrors.phone && (
              <p className="text-sm text-red-500">{formErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={form.address}
              onChange={handleInputChange("address")}
              className={formErrors.address ? "border-red-500" : ""}
              placeholder="Alamat lengkap"
              disabled={isLoading}
            />
            {formErrors.address && (
              <p className="text-sm text-red-500">{formErrors.address}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300"
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
