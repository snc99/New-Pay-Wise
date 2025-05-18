"use client";
import { toast } from "sonner";

export function useToastNotify() {
  const success = (message: string = "Berhasil!", desc?: string) =>
    toast.success(message, {
      description: desc,
    });

  const error = (message: string = "Terjadi kesalahan", desc?: string) =>
    toast.error(message, {
      description: desc,
    });

  const info = (message: string, desc?: string) =>
    toast(message, {
      description: desc,
    });

  return { success, error, info };
}
