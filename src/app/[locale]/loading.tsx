import { Skeleton } from "@assets/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-8">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
