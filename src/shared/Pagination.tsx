"use client";

import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import IonIcon from "@shared/IonIcon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // Number of siblings to show on each side of current page
  /** Authoritative "is there a next page" signal from the API; overrides the totalPages-derived check when provided */
  hasNext?: boolean;
}

/**
 * Generates an array of page numbers to display, with ellipsis where needed.
 * Example: [1, 2, 3, '...', 10] or [1, '...', 4, 5, 6, '...', 10]
 */
function generatePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
): (number | "...")[] {
  const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis slots

  // If total pages is less than what we'd show, just show all pages
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    // Show more pages at start: [1, 2, 3, 4, 5, ..., last]
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    // Show more pages at end: [1, ..., last-4, last-3, last-2, last-1, last]
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i,
    );
    return [1, "...", ...rightRange];
  }

  // Show ellipsis on both sides: [1, ..., current-1, current, current+1, ..., last]
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, "...", ...middleRange, "...", totalPages];
}

const Pagination: StyleableFC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  hasNext,
  className,
  style,
}) => {
  const paginationRange = generatePaginationRange(
    currentPage,
    totalPages,
    siblingCount,
  );
  const canGoNext = hasNext ?? currentPage < totalPages;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
      style={style}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(
          "flex h-10 w-10 mb-4 items-center justify-center rounded-full border-2 transition-all duration-200",
          "border-neutral-300 bg-neutral-white",
          currentPage === 1 ? "text-neutral-400" : "text-primary",
          "hover:border-primary hover:text-primary",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:text-neutral-400",
        )}
      >
        <IonIcon name="ChevronBackOutline" size="16px" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {paginationRange.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-12 w-12 items-center justify-center text-neutral-500 select-none"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-10 w-10 mb-4 items-center justify-center rounded-full label-large-emphasized leading-none transition-all duration-200",
                isActive
                  ? "bg-primary text-neutral-white shadow-elevation-1"
                  : "border-2 border-neutral-300 bg-neutral-white text-neutral-600 hover:border-primary hover:text-primary",
              )}
            >
              <span>{page}</span>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Next page"
        className={cn(
          "flex h-10 w-10 mb-4 items-center justify-center rounded-full border-2 transition-all duration-200",
          "border-neutral-300 bg-neutral-white",
          !canGoNext ? "text-neutral-400" : "text-primary",
          "hover:border-primary hover:text-primary",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-300 disabled:hover:text-neutral-400",
        )}
      >
        <IonIcon name="ChevronForwardOutline" size="16px" />
      </button>
    </nav>
  );
};

export default Pagination;
