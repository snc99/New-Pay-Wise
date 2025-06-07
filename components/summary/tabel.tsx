"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface DebtSummary {
  userId: string;
  userName: string;
  totalDebt: number;
  totalPaid: number;
  remaining: number;
  status: string;
}

interface DebtSummaryTableProps {
  data: DebtSummary[];
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function DebtSummaryTable({ data }: DebtSummaryTableProps) {
  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama User</TableHead>
            <TableHead>Total Utang</TableHead>
            <TableHead>Total Bayar</TableHead>
            <TableHead>Sisa Utang</TableHead>
            <TableHead>Status</TableHead>
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
                    Belum ada data utang yang tersedia.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.userId}>
                <TableCell>{item.userName}</TableCell>
                <TableCell>{formatRupiah(item.totalDebt)}</TableCell>
                <TableCell>{formatRupiah(item.totalPaid)}</TableCell>
                <TableCell
                  className={
                    item.remaining > 0 ? "text-red-600 font-medium" : ""
                  }
                >
                  {formatRupiah(item.remaining)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-md text-xs font-semibold ${
                      item.status === "Lunas"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
