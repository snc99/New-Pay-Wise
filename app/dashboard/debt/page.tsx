"use client";

import { useState, useEffect } from "react";
import { useToastNotify } from "@/lib/useToastNotify";
import { AdminTableSkeleton } from "@/components/admin/table-skeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import EditDebtModal from "@/components/debt/edit-modal";
import DebtForm from "@/components/debt/debt-form";
import DebtTable from "@/components/debt/tabel";
import { DeleteDebtModal } from "@/components/debt/delete";
import { Debt, User } from "@/types/debt";
import { getErrorMessage } from "@/lib/utils/error";
import { fetchJsonSafe } from "@/lib/utils/fetchJsonSafe";

export default function DebtPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [editDebt, setEditDebt] = useState<Debt | null>(null);
  const [deleteDebt, setDeleteDebt] = useState<Debt | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { error } = useToastNotify();

  // Fetch semua user
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Gagal memuat user");

      const json = await res.json();
      const users = Array.isArray(json) ? json : json.data;

      setUsers(users);
    } catch (err: unknown) {
      error(getErrorMessage(err)); // aman & konsisten
      console.error(err);
    }
  };

  // Fetch data utang lalu padukan dengan data user berdasarkan userId

  const fetchDebts = async (page: number = 1, search: string = searchTerm) => {
    setIsLoading(true);
    try {
      const { data, pagination } = await fetchJsonSafe<{
        data: Debt[];
        pagination: { totalPages: number; currentPage: number };
      }>(`/api/debt?page=${page}&search=${search}`);

      setDebts(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (err) {
      error(getErrorMessage(err));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      fetchDebts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchDebts(1, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchDebts(page);
  };

  const handleEdit = (debt: Debt) => {
    setEditDebt(debt);
    setEditModalOpen(true);
  };

  const handleDelete = (debt: Debt) => {
    setDeleteDebt(debt);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditDebt(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteDebt(null);
  };

  const onUpdated = () => {
    fetchDebts(currentPage);
    closeEditModal();
  };

  const onDeleted = () => {
    fetchDebts(currentPage);
    closeDeleteModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen Hutang
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola hutang di sini.
            </p>
          </div>
          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchInput
              placeholder="Cari hutang..."
              onSearch={handleSearch}
              className="w-full sm:w-64"
            />
            {users.length > 0 && (
              <DebtForm users={users} onSuccess={() => fetchDebts(1)} />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <AdminTableSkeleton />
          ) : (
            <>
              <div className="overflow-x-auto">
                <DebtTable
                  data={debts}
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

      {editDebt && (
        <EditDebtModal
          open={editModalOpen}
          onClose={closeEditModal}
          debt={editDebt}
          onUpdated={onUpdated}
        />
      )}

      {deleteDebt && (
        <DeleteDebtModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          debt={deleteDebt}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
