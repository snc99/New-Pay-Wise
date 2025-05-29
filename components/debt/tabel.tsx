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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface Debt {
  id: string;
  amount: number; // ubah jadi number agar konsisten dan aman saat formatting
  date: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DebtTableProps {
  data: Debt[];
  onEdit: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
}

export default function DebtTable({ data, onEdit, onDelete }: DebtTableProps) {
  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama User</TableHead>
            <TableHead>Nominal Utang</TableHead>
            <TableHead>Tanggal Utang</TableHead>
            <TableHead>Dibuat</TableHead>
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
                    Data utang belum dimasukkan.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.user.name}</TableCell>
                <TableCell>Rp {debt.amount.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  {new Date(debt.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(debt.createdAt).toLocaleDateString("id-ID", {
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
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(debt)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(debt)}
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
