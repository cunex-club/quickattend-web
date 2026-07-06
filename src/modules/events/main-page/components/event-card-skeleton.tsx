import { Skeleton } from "@assets/components/ui/skeleton";
import { cn } from "@assets/lib/utils";

interface EventCardSkeletonProps {
  isEnd?: boolean;
  className?: string;
}

/** Skeleton for an active (non-ended) event card */
const ActiveCardSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "p-4 sm:px-8 sm:py-6 rounded-xl shadow-lg bg-neutral-100 space-y-4",
      className,
    )}
  >
    {/* Title + menu */}
    <div className="flex justify-between items-center">
      <Skeleton className="h-7 lg:h-9 w-3/5" />
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>

    {/* Description + details */}
    <div className="flex flex-col sm:flex-row sm:items-start gap-y-4 sm:gap-x-6 md:gap-x-12.5">
      <div className="sm:flex-2 lg:px-4 space-y-2">
        <Skeleton className="h-5 w-24 hidden sm:block" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="sm:flex-1 space-y-2 lg:px-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28 hidden sm:block" />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-row gap-4 sm:gap-6">
      <Skeleton className="h-12 flex-1 rounded-full" />
      <Skeleton className="h-12 w-16 sm:flex-1 rounded-full" />
    </div>
  </div>
);

/** Skeleton for an ended (accordion) event card */
const EndedCardSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "p-4 sm:px-8 sm:py-6 rounded-xl shadow-lg bg-neutral-100",
      className,
    )}
  >
    <div className="flex justify-between items-center">
      <Skeleton className="h-7 lg:h-9 w-3/5" />
      <Skeleton className="h-5 w-5 rounded" />
    </div>
  </div>
);

const EventCardSkeleton = ({
  isEnd = false,
  className,
}: EventCardSkeletonProps) => {
  if (isEnd) return <EndedCardSkeleton className={className} />;
  return <ActiveCardSkeleton className={className} />;
};

export default EventCardSkeleton;
