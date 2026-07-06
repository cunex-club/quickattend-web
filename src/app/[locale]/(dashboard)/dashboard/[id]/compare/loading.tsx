import { Skeleton } from "@assets/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-8 w-full">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  );
}
