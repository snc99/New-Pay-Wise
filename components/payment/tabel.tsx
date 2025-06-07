"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Payment } from "@/types/payment";

interface PaymentWithRemaining extends Payment {
  totalRemaining: number;
  remainingCalculated?: number;
}

interface PaymentTableProps {
  data: PaymentWithRemaining[];
  onDelete: (payment: PaymentWithRemaining) => void;
}

const formatRupiah = (num: number) => `Rp ${num.toLocaleString("id-ID")}`;

export default function PaymentTable({ data, onDelete }: PaymentTableProps) {
  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama User</TableHead>
            <TableHead>Nominal Bayar</TableHead>
            <TableHead>Sisa Utang</TableHead>
            <TableHead>Tanggal Bayar</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <Image
                    src="/data-not-found.svg"
                    alt="Tidak ada data"
                    width={160}
                    height={160}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-semibold text-foreground">
                    Hasil Tidak Ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Belum ada pembayaran yang tercatat.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.debt.user.name}</TableCell>
                <TableCell>{formatRupiah(Number(payment.amount))}</TableCell>

                <TableCell>
                  {formatRupiah(payment.totalRemaining || 0)}
                </TableCell>
                <TableCell>
                  {new Date(payment.paidAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDelete(payment)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
