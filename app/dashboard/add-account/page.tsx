"use client";

import AdminForm from "@/components/admin/admin-add-form";
import ModalEditAdmin from "@/components/admin/admin-edit";
import AdminTable from "@/components/admin/admin-table";
import { useEffect, useState } from "react";
import { useToastNotify } from "@/lib/useToastNotify";
import { DeleteAdminModal } from "@/components/admin/delete-admin-modal";

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
  const { error } = useToastNotify();

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      error("Gagal memuat data admin");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Admin</h1>
        <AdminForm onSuccess={fetchAdmins} />
      </div>

      <AdminTable data={admins} onEdit={handleEdit} onDelete={handleDelete} />

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
