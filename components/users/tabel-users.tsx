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
import { Edit, MoreHorizontal, Trash2, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface UserTableProps {
  data: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  searchTerm: string;
  isSearching: boolean;
}

export default function UserTable({
  data,
  onEdit,
  onDelete,
  searchTerm,
  isSearching,
}: UserTableProps) {
  return (
    <div className="rounded-xl bg-white">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  {isSearching && searchTerm ? (
                    <>
                      <Image
                        src="/empty-state.svg"
                        alt="Hasil pencarian tidak ditemukan"
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
                    </>
                  ) : (
                    <>
                      <Image
                        src="/data-not-found.svg"
                        alt="Belum ada data"
                        width={160}
                        height={160}
                        className="mb-6"
                      />
                      <h3 className="text-lg font-semibold text-foreground">
                        Belum Ada Data
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Data belum tersedia, silakan tambahkan data baru.
                      </p>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("id-ID", {
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
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(user.phone)
                        }
                      >
                        <Phone className="mr-2 h-4 w-4" /> Salin Telepon
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(user.address)
                        }
                      >
                        <MapPin className="mr-2 h-4 w-4" /> Salin Alamat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
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
