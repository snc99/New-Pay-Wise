"use client";

import { useState, useEffect } from "react";
import { useToastNotify } from "@/lib/useToastNotify";
import { AdminTableSkeleton } from "@/components/admin/table-skeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchInput } from "@/components/admin/SearchInput";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DebtSummaryTable from "@/components/summary/tabel";

interface DebtSummary {
  userId: string;
  userName: string;
  totalDebt: number;
  totalPaid: number;
  remaining: number;
  status: string;
}

export default function DebtSummaryPage() {
  const [data, setData] = useState<DebtSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { error } = useToastNotify();

  const fetchSummary = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/summary?page=${page}&search=${encodeURIComponent(search)}`
      );
      if (!res.ok) throw new Error("Gagal memuat ringkasan utang");

      const json = await res.json();
      const { data, pagination } = json;

      setData(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (err) {
      error("Gagal memuat data ringkasan utang");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchSummary(1, term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchSummary(page, searchTerm);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card className="border border-muted shadow-md rounded-2xl">
        <CardHeader>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Ringkasan Utang
            </h2>
            <p className="text-muted-foreground text-sm">
              Menampilkan ringkasan utang per user, tanpa opsi tambah, edit,
              atau hapus.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <SearchInput
              placeholder="Cari nama user..."
              onSearch={handleSearch}
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <AdminTableSkeleton />
          ) : (
            <>
              <div className="overflow-x-auto">
                <DebtSummaryTable data={data} />
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
    </div>
  );
}
