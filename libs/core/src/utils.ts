import { Column } from '@tanstack/react-table';
import { type ClassValue, clsx } from 'clsx';
import _ from 'lodash';
import { withExtendedShadows } from 'tailwind-extended-shadows-merge';
import { extendTailwindMerge } from 'tailwind-merge';

import { CSSProperties } from 'react';

import { DocumentDetailResponse } from './generate/pb';

export type DocumentDetailData = DocumentDetailResponse & {
  children?: DocumentDetailData[];
  level?: string;
};

export function arrayToTree(
  arr: DocumentDetailData[],
  parent = 'root',
  parentLevel?: string
): DocumentDetailData[] {
  return _.chain(arr)
    .filter(item => item.parent === parent)
    .map(child => {
      const level = `${parentLevel ? parentLevel + '.' : ''}${child.index + 1}`;
      return {
        ...child,
        level,
        children: arrayToTree(arr, child.id, level)
      };
    })
    .sortBy('index')
    .value();
}

export function getCommonPinningStyles(
  column: Column<DocumentDetailData>
): CSSProperties {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0
  };
}

export const twMerge = extendTailwindMerge(withExtendedShadows);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return value
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    : '';
}

export function formatNumber(value: number) {
  return value ? new Intl.NumberFormat('vi-VN', {}).format(value) : '';
}
