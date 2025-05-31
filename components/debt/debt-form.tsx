"use client";

import { useState, useEffect, useRef } from "react";
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
import { Calendar } from "lucide-react";

const debtSchema = z.object({
  userId: z.string().min(1, "Pilih user terlebih dahulu"),
  amount: z
    .string()
    .regex(/^\d+$/, "Jumlah harus berupa angka")
    .refine((val) => parseInt(val, 10) > 0, "Jumlah harus lebih besar dari 0"),
  date: z.string().min(1, "Tanggal utang wajib diisi"),
});

interface UserOption {
  value: string;
  label: string;
}

interface Props {
  users: { id: string; name: string }[];
  onSuccess: () => void;
}

const initialForm = {
  userId: "",
  amount: "",
  date: "",
};

export default function DebtForm({ onSuccess }: Props) {
  const { success, error } = useToastNotify();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof initialForm, string>>
  >({});
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form saat dialog ditutup
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedUser(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = debtSchema.safeParse(form);
    if (!validation.success) {
      const errors = validation.error.errors.reduce((acc, err) => {
        const field = err.path[0] as keyof typeof form;
        acc[field] = err.message;
        return acc;
      }, {} as typeof formErrors);

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
        throw new Error(result?.message || "Gagal menambahkan utang");
      }

      success(
        `Utang berhasil ditambahkan untuk ${selectedUser?.label || "user"}`
      );
      onSuccess();
      setOpen(false);
    } catch (err) {
      error(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserOptions = async (inputValue: string): Promise<UserOption[]> => {
    const query = inputValue.trim();
    if (!query) return [];

    try {
      const res = await fetch(
        `/api/user/select/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
      console.error("Gagal memuat user:", err);
      return [];
    }
  };

  const openDatePicker = () => {
    dateInputRef.current?.showPicker();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow hover:shadow-md transition-all">
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

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="userId">Pilih User</Label>
            <AsyncSelect
              inputId="userId"
              cacheOptions
              defaultOptions
              loadOptions={loadUserOptions}
              isDisabled={isLoading}
              value={selectedUser}
              onChange={(selected) => {
                setSelectedUser(selected);
                setForm({ ...form, userId: selected?.value || "" });
              }}
              placeholder="Cari & Pilih User"
              classNamePrefix="select"
              classNames={{
                control: (state) =>
                  `border rounded-md ${
                    formErrors.userId
                      ? "border-red-500"
                      : state.isFocused
                      ? "border-blue-500 ring-1 ring-blue-500"
                      : "border-gray-300"
                  }`,
              }}
            />
            {formErrors.userId && (
              <p className="text-sm text-red-500 mt-1">{formErrors.userId}</p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal Utang (Rp)</Label>
            <Input
              id="amount"
              value={form.amount}
              onChange={handleInputChange("amount")}
              className={formErrors.amount ? "border-red-500" : ""}
              placeholder="Masukkan jumlah utang"
              disabled={isLoading}
              inputMode="numeric"
            />
            {formErrors.amount && (
              <p className="text-sm text-red-500">{formErrors.amount}</p>
            )}
          </div>

          {/* Date Input */}
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal Utang</Label>
            <div className="relative">
              <Input
                ref={dateInputRef}
                id="date"
                type="date"
                value={form.date}
                onChange={handleInputChange("date")}
                className={`
                  w-full pl-3 pr-10 py-2 rounded-md border
                  ${formErrors.date ? "border-red-500" : "border-gray-300"}
                  ${isLoading ? "bg-gray-100" : ""}
                  [&::-webkit-calendar-picker-indicator]:hidden
                `}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={openDatePicker}
                disabled={isLoading}
              >
                <Calendar className="h-5 w-5" />
              </button>
            </div>
            {formErrors.date && (
              <p className="text-sm text-red-500">{formErrors.date}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
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
