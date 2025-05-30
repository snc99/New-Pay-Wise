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
  totalDebt: number; // total utang
  totalPaid: number; // total pembayaran
  remaining: number; // sisa utang
  status: string; // "Lunas" atau "Belum Lunas"
}

interface DebtSummaryTableProps {
  data: DebtSummary[];
}

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
                <TableCell>
                  Rp {item.totalDebt.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  Rp {item.totalPaid.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  Rp {item.remaining.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
