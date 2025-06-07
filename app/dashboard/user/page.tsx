"use client";

import { useState, useEffect } from "react";
import { useToastNotify } from "@/lib/useToastNotify";
import { AdminTableSkeleton } from "@/components/admin/table-skeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserTable from "@/components/users/tabel";
import EditModal from "@/components/users/edit-modal";
import { DeleteUserModal } from "@/components/users/delete";
import UserForm from "@/components/users/user-form";

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
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
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
      const res = await fetch(`/api/user?page=${page}&search=${search}`);
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
    setEditUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeleteUser(user);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditUser(null);
  };

  const closeDeleteModal = () => {
    console.log("closeDeleteModal called");
    setDeleteModalOpen(false);
    setDeleteUser(null);
  };

  const onUpdated = () => {
    fetchUsers();
    closeEditModal();
  };

  const onDeleted = () => {
    fetchUsers();
    closeDeleteModal();
  };

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
            <UserForm onSuccess={() => fetchUsers(1)} />
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

      {editUser && (
        <EditModal
          open={editModalOpen}
          onClose={closeEditModal}
          user={editUser}
          onUpdated={onUpdated}
        />
      )}

      {deleteUser && (
        <DeleteUserModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          user={deleteUser}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
