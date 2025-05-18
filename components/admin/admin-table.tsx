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
  onDelete: (admin: Admin) => void; // Diubah dari adminId ke admin object
}

export default function AdminTable({
  data,
  onEdit,
  onDelete,
}: AdminTableProps) {
  return (
    <Table>
      <TableHeader>
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
        {data.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell>{admin.name}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>{admin.username}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  admin.role === "SUPERADMIN"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {admin.role}
              </span>
            </TableCell>
            <TableCell>
              {new Date(admin.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(admin.username)
                    }
                  >
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    <span>Copy username</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(admin.email)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Copy email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(admin)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit admin</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(admin)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Hapus admin</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
