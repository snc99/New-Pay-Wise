import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="w-64 border-r bg-white p-4">
        <div className="mb-8 flex items-center space-x-2">
          <Skeleton className="h-8 w-32" />
        </div>

        <nav className="space-y-2">
          {/* 7 Menu Items Skeleton */}
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 rounded-md p-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-auto p-8">
        <header className="mb-8 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </header>

        {/* 3 Cards Grid Skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
              <Skeleton className="mb-2 h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>

        {/* 1 Large Card at Bottom Skeleton */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-3/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
