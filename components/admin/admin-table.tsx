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
import {
  ClipboardCopy,
  Edit,
  MoreHorizontal,
  Trash2,
  Mail,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "SUPERADMIN" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

interface AdminTableProps {
  data: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
}

export default function AdminTable({
  data,
  onEdit,
  onDelete,
}: AdminTableProps) {
  return (
    <div className="rounded-xl  bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <Image
                    src="/empty-state.svg" // ganti dengan path gambar kamu
                    alt="Tidak ada data"
                    width={160}
                    height={160}
                    className="mb-6"
                  />
                  <h3 className="text-lg font-semibold text-foreground">
                    Hasil Tidak Ditemukan
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Silakan coba dengan kata kunci yang berbeda.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.username}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                      admin.role === "SUPERADMIN"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    )}
                  >
                    {admin.role}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(admin.createdAt).toLocaleDateString("id-ID", {
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
                      <DropdownMenuSeparator asChild />
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(admin.username)
                        }
                      >
                        <ClipboardCopy className="mr-2 h-4 w-4" /> Salin
                        Username
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(admin.email)
                        }
                      >
                        <Mail className="mr-2 h-4 w-4" /> Salin Email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setTimeout(() => {
                            onEdit(admin);
                          }, 0);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                          }
                          setTimeout(() => {
                            onDelete(admin);
                          }, 0);
                        }}
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
