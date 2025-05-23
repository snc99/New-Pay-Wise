"use client";

import { useState, useEffect, use } from "react";
import AdminForm from "@/components/admin/admin-add-form";
import ModalEditAdmin from "@/components/admin/admin-edit";
import AdminTable from "@/components/admin/admin-table";
import { useToastNotify } from "@/lib/useToastNotify";
import { DeleteAdminModal } from "@/components/admin/delete-admin-modal";
import { AdminTableSkeleton } from "@/components/admin/table-skeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserTable from "@/components/users/tabel-users";
import User from "@prisma/client";
import { U } from "framer-motion/dist/types.d-CtuPurYT";

interface User {
  id: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editAdmin, setEditAdmin] = useState<User | null>(null);
  const [deleteAdmin, setDeleteAdmin] = useState<User | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { error } = useToastNotify();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async (page: number = 1, search: string = searchTerm) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?page=${page}&search=${search}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const { data, pagination } = await res.json();
      setUsers(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (err) {
      error("Gagal memuat data admin");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchUsers(1, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  const handleEdit = (user: User) => {
    setEditAdmin(user);
    setEditModalOpen(true);
  };

  const handleDelete = (User: User) => {
    setDeleteAdmin(User);
    setDeleteModalOpen(true);
  };

  // const closeEditModal = () => {
  //   setEditModalOpen(false);
  //   setEditAdmin(null);
  // };

  // const closeDeleteModal = () => {
  //   setDeleteModalOpen(false);
  //   setDeleteAdmin(null);
  // };

  // const onUpdated = () => {
  //   fetchUsers();
  //   closeEditModal();
  // };

  // const onDeleted = () => {
  //   fetchUsers();
  //   closeDeleteModal();
  // };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen User
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola user di sini.
            </p>
          </div>
          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchInput
              placeholder="Cari user..."
              onSearch={handleSearch}
              className="w-full sm:w-64"
            />
            <AdminForm onSuccess={() => fetchUsers(1)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <AdminTableSkeleton />
          ) : (
            <>
              <div className="overflow-x-auto">
                <UserTable
                  data={users}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* {editUsers && (
        <ModalEditUsers
          open={editModalOpen}
          onClose={closeEditModal}
          users={editAdmin}
          onUpdated={onUpdated}
        />
      )} */}

      {/* {deleteAdmin && (
        <DeleteAdminModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          admin={deleteAdmin}
          onDeleted={onDeleted}
        />
      )} */}
    </div>
  );
}
