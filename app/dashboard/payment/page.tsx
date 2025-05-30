"use client";

import { useState, useEffect } from "react";
import { useToastNotify } from "@/lib/useToastNotify";
import { AdminTableSkeleton } from "@/components/admin/table-skeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PaymentForm from "@/components/payment/payment-form";
import { DeletePaymentModal } from "@/components/payment/delete";
import { Payment } from "@/types/payment";
import { User } from "@/types/user";
import PaymentTable from "@/components/payment/tabel";

export default function PaymentPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { error } = useToastNotify();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Gagal memuat user");

      const json = await res.json();
      const users = Array.isArray(json) ? json : json.data;

      setUsers(users);
    } catch (err) {
      error("Gagal memuat data user");
      console.error(err);
    }
  };

  const fetchPayments = async (
    page: number = 1,
    search: string = searchTerm
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/payment?page=${page}&search=${search}`);
      if (!res.ok) throw new Error("Gagal memuat pembayaran");

      const {
        data,
        pagination,
      }: {
        data: Payment[];
        pagination: { totalPages: number; currentPage: number };
      } = await res.json();

      setPayments(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (err) {
      error("Gagal memuat data pembayaran");
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
      fetchPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchPayments(1, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPayments(page);
  };

  const handleDelete = (payment: Payment) => {
    setDeletePayment(payment);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletePayment(null);
  };

  const onDeleted = () => {
    fetchPayments(currentPage);
    closeDeleteModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Manajemen Pembayaran
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola pembayaran di sini.
            </p>
          </div>
          <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <SearchInput
              placeholder="Cari pembayaran..."
              onSearch={handleSearch}
              className="w-full sm:w-64"
            />
            {users.length > 0 && (
              <PaymentForm onSuccess={() => fetchPayments(1)} />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <AdminTableSkeleton />
          ) : (
            <>
              <div className="overflow-x-auto">
                <PaymentTable data={payments} onDelete={handleDelete} />
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

      {deletePayment && (
        <DeletePaymentModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          payment={deletePayment}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
