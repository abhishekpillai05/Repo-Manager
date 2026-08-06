import { useMemo } from 'react';

export interface UsePaginationOptions {
  totalPages: number;
  currentPage: number;
  siblingCount?: number;
}

const DOTS = '...' as const;

export function usePagination({ totalPages, currentPage, siblingCount = 1 }: UsePaginationOptions) {
  const pages = useMemo(() => {
    if (totalPages <= 0) return [];

    const totalNumbers = siblingCount * 2 + 5; // siblings + first + last + currentPage + 2 dots

    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + 1 + i,
      );
      return [1, DOTS, ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );

    return [1, DOTS, ...middleRange, DOTS, totalPages];
  }, [totalPages, currentPage, siblingCount]);

  return { pages, DOTS };
}
