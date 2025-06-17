import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardChartSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Skeleton Chart 1 */}
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col justify-between">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-11/12 mb-2" />
          <Skeleton className="h-6 w-10/12 mb-2" />
          <Skeleton className="h-6 w-9/12 mb-2" />
          <Skeleton className="h-6 w-8/12 mb-2" />
          <Skeleton className="h-6 w-7/12 mb-2" />
        </CardContent>
      </Card>

      {/* Skeleton Chart 2 */}
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col justify-between">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-11/12 mb-2" />
          <Skeleton className="h-6 w-10/12 mb-2" />
          <Skeleton className="h-6 w-9/12 mb-2" />
          <Skeleton className="h-6 w-8/12 mb-2" />
          <Skeleton className="h-6 w-7/12 mb-2" />
        </CardContent>
      </Card>
    </div>
  );
}
