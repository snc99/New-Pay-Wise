"use client";

import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

type DebtRecord = {
  id: number;
  name: string;
  total: number;
  bayar: number;
  tagihan: number;
};

export default function DebtTable() {
  const allData = useMemo<DebtRecord[]>(
    () => [
      { id: 1, name: "Andre", total: 10000, bayar: 3000, tagihan: 7000 },
      { id: 2, name: "Ilda", total: 12000, bayar: 10000, tagihan: 2000 },
      { id: 3, name: "Rehan", total: 20000, bayar: 15000, tagihan: 5000 },
      { id: 4, name: "Sufi", total: 13000, bayar: 10000, tagihan: 3000 },
      { id: 5, name: "Denis", total: 10000, bayar: 9000, tagihan: 1000 },
    ],
    []
  );

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof DebtRecord;
    direction: "asc" | "desc";
  } | null>(null);

  const filteredData = useMemo(() => {
    return allData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [allData, search]);

  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aKey = a[sortConfig.key];
        const bKey = b[sortConfig.key];

        if (typeof aKey === "string" && typeof bKey === "string") {
          return sortConfig.direction === "asc"
            ? aKey.localeCompare(bKey)
            : bKey.localeCompare(aKey);
        } else if (typeof aKey === "number" && typeof bKey === "number") {
          return sortConfig.direction === "asc" ? aKey - bKey : bKey - aKey;
        } else {
          return 0;
        }
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / perPage);
  const paginated = useMemo(
    () => sortedData.slice((page - 1) * perPage, page * perPage),
    [sortedData, page, perPage]
  );

  // Optional: Fungsi untuk toggle sorting ketika header diklik
  const requestSort = (key: keyof DebtRecord) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-auto bg-gradient-to-br from-[#67C3F3] to-[#5A98F2] pt-24 text-black">
      <section
        className="w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 "
        id="Debt"
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">
          Tabel Pencatatan
        </h2>

        <Image
          src="/bullet.svg"
          width={160}
          height={160}
          alt="Background bullet"
          className="absolute top-10 right-0 opacity-30 z-0 pointer-events-none select-none"
        />

        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Show</span>
            <Select
              value={perPage.toString()}
              onValueChange={(val) => {
                setPerPage(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm">entries</span>
          </div>

          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
        </div>

        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-gray-50">
              <TableHead
                className="text-center cursor-pointer"
                onClick={() => requestSort("id")}
              >
                No
              </TableHead>
              <TableHead
                className="text-center cursor-pointer select-none"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center justify-center gap-1">
                  Nama
                  {sortConfig?.key === "name" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUp size={14} className="opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="text-center cursor-pointer select-none"
                onClick={() => requestSort("total")}
              >
                <div className="flex items-center justify-center gap-1">
                  Total
                  {sortConfig?.key === "total" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUp size={14} className="opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="text-center cursor-pointer select-none"
                onClick={() => requestSort("bayar")}
              >
                <div className="flex items-center justify-center gap-1">
                  Bayar
                  {sortConfig?.key === "bayar" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUp size={14} className="opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="text-center cursor-pointer select-none"
                onClick={() => requestSort("tagihan")}
              >
                <div className="flex items-center justify-center gap-1">
                  Tagihan
                  {sortConfig?.key === "tagihan" ? (
                    sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUp size={14} className="opacity-30" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((record, index) => (
              <TableRow key={record.id} className="border-none">
                <TableCell className="text-center">
                  {(page - 1) * perPage + index + 1}
                </TableCell>
                <TableCell className="py-6 px-4 font-medium text-gray-800 text-center">
                  {record.name}
                </TableCell>
                <TableCell className="text-gray-800 py-6 px-4 text-center">
                  {new Intl.NumberFormat("id-ID").format(record.total)}
                </TableCell>
                <TableCell className="text-gray-800 py-6 px-4 text-center">
                  {new Intl.NumberFormat("id-ID").format(record.bayar)}
                </TableCell>
                <TableCell className="text-gray-800 py-6 px-4 text-center">
                  {new Intl.NumberFormat("id-ID").format(record.tagihan)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-800">
          <div>
            Showing {paginated.length} of {filteredData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded bg-white text-black border"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <button
              className="px-3 py-1 rounded bg-white text-black border"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
