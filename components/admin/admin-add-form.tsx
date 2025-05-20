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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToastNotify } from "@/lib/useToastNotify";
import { adminSchema } from "@/lib/validation-zod/admin-schema";
import { FiUserPlus, FiX, FiEye, FiEyeOff } from "react-icons/fi";

interface Props {
  onSuccess: () => void;
}

const initialForm = {
  name: "",
  email: "",
  username: "",
  password: "",
  role: "ADMIN" as "ADMIN" | "SUPERADMIN",
};

export default function AdminForm({ onSuccess }: Props) {
  const { success, error } = useToastNotify();

  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof initialForm, string>>
  >({});
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // **Tambah state loading**
  const [isLoading, setIsLoading] = useState(false);

  // Reset form ketika modal dibuka/ditutup
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setForm(initialForm);
    setFormErrors({});
    setShowPassword(false);
    setIsLoading(false); // Reset loading juga
  };

  // Handler untuk menghapus error saat user mulai mengetik
  const handleInputChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
      if (formErrors[field]) {
        setFormErrors({ ...formErrors, [field]: undefined });
      }
    };

  const handleSelectChange = (val: string) => {
    setForm({ ...form, role: val as "ADMIN" | "SUPERADMIN" });
    if (formErrors.role) {
      setFormErrors({ ...formErrors, role: undefined });
    }
  };

  const handleSubmit = async () => {
    // Reset error terlebih dahulu sebelum validasi
    setFormErrors({});

    const validation = adminSchema.safeParse(form);

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
      setIsLoading(true); // mulai loading
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const result = await res.json();
        if (result?.field) {
          setFormErrors({ [result.field]: result.message });
        } else {
          throw new Error(result?.message || "Gagal menambahkan admin");
        }
        setIsLoading(false);
        return;
      }

      const result = await res.json();
      success(`${result.data?.name || "Admin"} berhasil ditambahkan`);
      onSuccess();
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message || "Terjadi kesalahan saat menambahkan admin");
        console.error(err);
      } else {
        error("Terjadi kesalahan saat menambahkan admin");
        console.error("Unknown error:", err);
      }
    } finally {
      setIsLoading(false); // stop loading di akhir
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all">
          <FiUserPlus className="mr-2 h-4 w-4" />
          Tambah Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <div className="relative">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Tambah Admin Baru
            </DialogTitle>
          </DialogHeader>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-0 right-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form
          className="grid gap-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Form fields tetap sama, tidak perlu diubah */}

          {/* ... form fields di sini ... */}
          {/* Salin isi fields dari kode asli kamu */}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={handleInputChange("name")}
              className={`${formErrors.name ? "border-red-500" : ""}`}
              placeholder="Masukkan nama lengkap"
              disabled={isLoading}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={handleInputChange("email")}
              className={`${formErrors.email ? "border-red-500" : ""}`}
              placeholder="contoh@email.com"
              disabled={isLoading}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Username
            </Label>
            <Input
              id="username"
              value={form.username}
              onChange={handleInputChange("username")}
              className={`${formErrors.username ? "border-red-500" : ""}`}
              placeholder="Masukkan username"
              disabled={isLoading}
            />
            {formErrors.username && (
              <p className="text-sm text-red-500 mt-1">{formErrors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleInputChange("password")}
                className={`${
                  formErrors.password ? "border-red-500" : ""
                } pr-10`}
                placeholder="Minimal 8 karakter"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Role</Label>
            <Select
              value={form.role}
              onValueChange={handleSelectChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full" disabled={isLoading}>
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="ADMIN"
                  className="hover:bg-indigo-50 focus:bg-indigo-50"
                >
                  ADMIN
                </SelectItem>
                <SelectItem
                  value="SUPERADMIN"
                  className="hover:bg-indigo-50 focus:bg-indigo-50"
                >
                  SUPERADMIN
                </SelectItem>
              </SelectContent>
            </Select>
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
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Admin"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
