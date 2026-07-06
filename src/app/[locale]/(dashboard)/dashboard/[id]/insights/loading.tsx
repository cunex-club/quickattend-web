import { Skeleton } from "@assets/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-16">
      {/* Filter section skeleton */}
      <section className="flex flex-col space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </section>

      {/* Stats cards skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </section>

      {/* Charts section skeleton */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </section>
    </div>
  );
}
