import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import * as React from 'react';
import { FC } from 'react';

import { Button } from '../button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

export const DEFAULT_PAGE_SIZE = 15;

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
  totalPages?: number;
  pageIndex?: number;
  pageSize?: number;
  showLabel?: boolean;
  showSelect?: boolean;
  onPageNext?: () => void;
  onPagePrev?: () => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export const Pagination: FC<PaginationProps> = ({
  totalItems = 0,
  totalPages = 0,
  pageIndex = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  showLabel = true,
  showSelect = true,
  onPageNext,
  onPagePrev,
  onPageSizeChange
}) => {
  return (
    <div className={`flex items-center gap-2 p-2 text-sm`}>
      {showLabel ? (
        <div
          className={`text-appBlack`}
        >{`Trang ${pageIndex} / ${Math.ceil(totalItems / pageSize)}`}</div>
      ) : null}

      <Button
        variant={'outline'}
        className={'h-8 w-8 p-0'}
        onClick={onPagePrev}
        disabled={pageIndex === 1}
      >
        <ChevronLeftIcon />
      </Button>
      {showSelect && (
        <div className={`w-20`}>
          <Select
            value={pageSize.toString()}
            onValueChange={value => {
              onPageSizeChange?.(parseInt(value));
            }}
          >
            <SelectTrigger className={'h-8'}>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="11">11</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="13">13</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <Button
        variant={'outline'}
        className={'h-8 w-8 p-0'}
        onClick={onPageNext}
        disabled={pageIndex === totalPages}
      >
        <ChevronRightIcon className={'h-4 w-4'} />
      </Button>
    </div>
  );
};
