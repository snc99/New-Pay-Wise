import { Skeleton } from "@/components/ui/skeleton";

export const DashboardCardSkeleton = () => {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      {[1, 2, 3].map((_, idx) => (
        <div
          key={idx}
          className="relative rounded-xl bg-muted/50 p-4 shadow-md overflow-hidden"
        >
          <div className="relative z-10 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>

          <div className="absolute -right-24 -top-10">
            <Skeleton className="w-[198px] h-[230px] rounded-md" />
          </div>

          <div className="absolute bottom-4 right-4 text-muted-foreground">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
