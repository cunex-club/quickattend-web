import { Skeleton } from "@assets/components/ui/skeleton";

const EventDetailSkeleton = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center px-6 md:px-10 lg:px-25 py-10 lg:pt-35 gap-6 lg:gap-7.5 pb-24">
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Main content card */}
        <div className="lg:flex-[4] bg-neutral-100 p-6 lg:p-10 space-y-5 rounded-3xl shadow-xs">
          {/* Title + edit icon */}
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-9 lg:h-11 w-3/5" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Date / time / location / person */}
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-44" />
            </div>
            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Event details section */}
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Agenda section */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:flex-1 flex flex-col sm:flex-row lg:flex-col justify-between gap-6 lg:gap-10">
          {/* Registered count card */}
          <div className="flex-1 flex flex-col justify-center items-start lg:items-center bg-primary/20 h-full px-8 py-6 lg:p-10 rounded-3xl shadow-xs space-y-2">
            <Skeleton className="h-5 w-32 bg-primary/30" />
            <Skeleton className="h-14 lg:h-20 w-24 bg-primary/30" />
            <Skeleton className="h-4 w-48 bg-primary/30" />
          </div>

          {/* Organizer card */}
          <div className="flex-1 lg:flex-none flex flex-col justify-center items-center gap-2.5 bg-neutral-100 p-5 rounded-3xl shadow-xs">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-row w-full gap-4 lg:gap-6">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 flex-1 rounded-full hidden md:block" />
        <div className="flex gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
