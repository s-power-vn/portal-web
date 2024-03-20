import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import { FC } from 'react';
import * as React from 'react';

import { cn } from '@storeo/core';

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [
  {
    id: 1,
    value: 10
  },
  {
    id: 2,
    value: 20
  },
  {
    id: 3,
    value: 30
  }
];

export const DOTS = '...';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export type FormatType = string | number;

export function formatStr(str: string, ...params: FormatType[]): string {
  const args = params;
  return str.replace(/{([0-9]+)}/g, (match, index) => {
    if (typeof args[index] === 'undefined') {
      return match;
    }
    return args[index].toString();
  });
}

export const usePagination = ({
  totalItems,
  currentPage,
  pageSize,
  siblingCount = 1
}: {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  siblingCount?: number;
}) => {
  const totalPageCount = Math.ceil(totalItems / pageSize);

  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPageCount
  );

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = range(1, leftItemCount);

    return [...leftRange, DOTS, totalPageCount];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = range(
      totalPageCount - rightItemCount + 1,
      totalPageCount
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return [];
};

export type PaginationProps = {
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  pageSizeOptions?: { id: number; value: number }[];
  showLabel?: boolean;
  showSelect?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  labelText?: string;
};

export const Pagination: FC<PaginationProps> = ({
  totalItems = 0,
  currentPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showLabel,
  showSelect,
  onPageChange,
  onPageSizeChange,
  labelText = 'Showing {0}-{1} of {2} items',
  ...props
}) => {
  const pagination = usePagination({
    totalItems,
    currentPage,
    pageSize
  });

  if (currentPage > 1 && (currentPage - 1) * pageSize === totalItems) {
    onPageChange?.(currentPage - 1);
  }

  return (
    <div className={`flex w-full items-center justify-center p-2 text-sm`}>
      <div>
        {showLabel && totalItems > 0 && (
          <div className={`text-primary`}>
            {formatStr(
              labelText,
              (currentPage - 1) * pageSize + 1,
              currentPage * pageSize < totalItems
                ? currentPage * pageSize
                : totalItems,
              totalItems
            )}
          </div>
        )}
      </div>
      <div className={`flex items-center gap-2`}>
        <ul className={`box-border flex w-max rounded-md border`} {...props}>
          <li
            className={`flex cursor-pointer select-none items-center justify-center border-r px-3 py-1.5
              last:border-r-0 hover:bg-gray-50 last:hover:rounded-r-md first-of-type:hover:rounded-l-md`}
            onClick={() => {
              if (currentPage > 1) {
                onPageChange?.(currentPage - 1);
              }
            }}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </li>
          {pagination &&
            pagination.map((value, i) => {
              return (
                <li
                  key={i}
                  className={cn(
                    `flex cursor-pointer select-none items-center justify-center border-r px-3 py-1.5
                    last:border-r-0 hover:bg-gray-50 last:hover:rounded-r-md first-of-type:hover:rounded-l-md`,
                    currentPage === value
                      ? `text-appBlack bg-appGrayLight font-semibold`
                      : `text-appBlack`
                  )}
                  onClick={() => {
                    if (typeof value === 'number') {
                      onPageChange?.(value);
                    }
                  }}
                >
                  {value}
                </li>
              );
            })}
          <li
            className={`flex cursor-pointer select-none items-center justify-center border-r px-3 py-1.5
              last:border-r-0 hover:bg-gray-50 last:hover:rounded-r-md first-of-type:hover:rounded-l-md`}
            onClick={() => {
              const totalPageCount = Math.ceil(totalItems / pageSize);
              if (currentPage < totalPageCount) {
                onPageChange?.(currentPage + 1);
              }
            }}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </li>
        </ul>
        {showSelect && <div className={`w-24`}></div>}
      </div>
    </div>
  );
};
