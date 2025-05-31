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
import AsyncSelect from "react-select/async";

const debtSchema = z.object({
  userId: z.string().min(1, "Pilih user terlebih dahulu"),
  amount: z
    .string()
    .regex(/^\d+$/, "Jumlah harus berupa angka")
    .refine((val) => parseInt(val, 10) > 0, "Jumlah harus lebih besar dari 0"),
  date: z.string().min(1, "Tanggal utang wajib diisi"),
});

interface Props {
  users: { id: string; name: string }[]; // List user untuk dropdown pilih user
  onSuccess: () => void;
}

const initialForm = {
  userId: "",
  amount: "",
  date: "",
};

export default function DebtForm({ users, onSuccess }: Props) {
  const { success, error } = useToastNotify();

  const [selectedUser, setSelectedUser] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof initialForm, string>>
  >({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setForm(initialForm);
    setFormErrors({});
    setIsLoading(false);
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

    const validation = debtSchema.safeParse(form);
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
      const res = await fetch("/api/debt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const result = await res.json();
        if (result?.field) {
          setFormErrors({ [result.field]: result.message });
        } else {
          throw new Error(result?.message || "Gagal menambahkan utang");
        }
        setIsLoading(false);
        return;
      }

      await res.json();
      success(
        `Utang berhasil ditambahkan untuk user ${
          users.find((u) => u.id === form.userId)?.name || ""
        }`
      );
      onSuccess();
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error(err.message || "Terjadi kesalahan saat menambahkan utang");
        console.error(err);
      } else {
        error("Terjadi kesalahan saat menambahkan utang");
        console.error("Unknown error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserOptions = async (inputValue: string) => {
    const query = inputValue.trim(); // hapus spasi di awal/akhir
    if (!query) return [];

    const res = await fetch(
      `/api/user/select/search?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];

    return await res.json();
  };

  useEffect(() => {
    const loadSelectedUser = async () => {
      if (form.userId && !selectedUser) {
        try {
          const res = await fetch(`/api/user/${form.userId}`);
          if (!res.ok) return;

          const data = await res.json();
          setSelectedUser({ value: data.id, label: data.name });
        } catch (err) {
          console.error("Gagal memuat user:", err);
        }
      }
    };

    loadSelectedUser();
  }, [form.userId, selectedUser]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all">
          <FiPlusCircle className="mr-2 h-4 w-4" />
          Tambah Utang
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tambah Utang Baru
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
            <Label htmlFor="userId" className="text-gray-700 font-medium">
              Pilih User
            </Label>
            <AsyncSelect
              inputId="userId"
              cacheOptions
              defaultOptions
              loadOptions={loadUserOptions}
              isDisabled={isLoading}
              value={form.userId ? selectedUser : null}
              onChange={(selectedOption) => {
                setForm({ ...form, userId: selectedOption?.value || "" });
                setSelectedUser(selectedOption || null);
              }}
              placeholder="-- Cari & Pilih User --"
              classNames={{
                control: () =>
                  `border ${
                    formErrors.userId ? "border-red-500" : "border-gray-300"
                  } rounded-md`,
              }}
            />

            {formErrors.userId && (
              <p className="text-sm text-red-500 mt-1">{formErrors.userId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 font-medium">
              Nominal Utang (Rp)
            </Label>
            <Input
              id="amount"
              value={form.amount}
              onChange={handleInputChange("amount")}
              className={`${formErrors.amount ? "border-red-500" : ""}`}
              placeholder="Masukkan jumlah utang"
              disabled={isLoading}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {formErrors.amount && (
              <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 font-medium">
              Tanggal Utang
            </Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={handleInputChange("date")}
              className={`${formErrors.date ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {formErrors.date && (
              <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>
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
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
