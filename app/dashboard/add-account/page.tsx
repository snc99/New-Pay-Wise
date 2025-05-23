"use client";

import { useState, useEffect } from "react";
import AdminForm from "@/components/admin/admin-add-form";
import ModalEditAdmin from "@/components/admin/admin-edit";
import AdminTable from "@/components/admin/admin-table";
import { useToastNotify } from "@/lib/useToastNotify";
import { DeleteAdminModal } from "@/components/admin/delete-admin-modal";
import { AdminTableSkeleton } from "@/components/admin/table-skeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Admin {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "SUPERADMIN" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export default function AddAccountPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [deleteAdmin, setDeleteAdmin] = useState<Admin | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { error } = useToastNotify();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdmins = async (page: number = 1, search: string = searchTerm) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin?page=${page}&search=${search}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const { data, pagination } = await res.json();
      setAdmins(data);
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
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchAdmins(1, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdmins(page);
  };

  const handleEdit = (admin: Admin) => {
    setEditAdmin(admin);
    setEditModalOpen(true);
  };

  const handleDelete = (admin: Admin) => {
    setDeleteAdmin(admin);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditAdmin(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteAdmin(null);
  };

  const onUpdated = () => {
    fetchAdmins();
    closeEditModal();
  };

  const onDeleted = () => {
    fetchAdmins();
    closeDeleteModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen Admin
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola akun admin yang memiliki akses sistem.
            </p>
          </div>
          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchInput
              placeholder="Cari admin..."
              onSearch={handleSearch}
              className="w-full sm:w-64"
            />
            <AdminForm onSuccess={() => fetchAdmins(1)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <AdminTableSkeleton />
          ) : (
            <>
              <div className="overflow-x-auto">
                <AdminTable
                  data={admins}
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

      {editAdmin && (
        <ModalEditAdmin
          open={editModalOpen}
          onClose={closeEditModal}
          admin={editAdmin}
          onUpdated={onUpdated}
        />
      )}

      {deleteAdmin && (
        <DeleteAdminModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          admin={deleteAdmin}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
