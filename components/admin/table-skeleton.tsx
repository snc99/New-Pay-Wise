// components/admin/AdminTableSkeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function AdminTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4">
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
      </div>

      {/* Rows */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4">
          <Skeleton className="h-6 rounded-md" />
          <Skeleton className="h-6 rounded-md" />
          <Skeleton className="h-6 rounded-md" />
          <Skeleton className="h-6 rounded-md" />
          <Skeleton className="h-6 rounded-md" />
          <Skeleton className="h-6 rounded-md" />
        </div>
      ))}
    </div>
  );
}
