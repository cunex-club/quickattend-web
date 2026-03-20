import { Skeleton } from "@assets/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-16">
      {/* Event information section skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-8">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
        <Skeleton className="h-[250px] w-full" />
      </section>

      {/* Chart section skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </section>
    </div>
  );
}
