"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const generatePages = (): (number | "...")[] => {
    const leftEdge = range(1, Math.min(3, totalPages));
    const rightEdge = range(Math.max(totalPages - 2, 4), totalPages);

    const aroundCurrent = range(
      Math.max(currentPage - 1, 4),
      Math.min(currentPage + 1, totalPages - 3)
    );

    const uniquePages = new Set<number | "...">();

    leftEdge.forEach((p) => uniquePages.add(p));
    if (aroundCurrent[0] > 4) uniquePages.add("...");
    aroundCurrent.forEach((p) => uniquePages.add(p));
    if (aroundCurrent[aroundCurrent.length - 1] < totalPages - 3)
      uniquePages.add("...");
    rightEdge.forEach((p) => uniquePages.add(p));

    return Array.from(uniquePages);
  };

  const pagesToShow = generatePages();

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Halaman {currentPage} dari {totalPages}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pagesToShow.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className={cn(
                page === currentPage && "bg-blue-100 text-blue-800"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
