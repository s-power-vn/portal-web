/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from '@tanstack/react-table';
import { type ClassValue, clsx } from 'clsx';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { withExtendedShadows } from 'tailwind-extended-shadows-merge';
import { extendTailwindMerge } from 'tailwind-merge';

import { CSSProperties } from 'react';

import { DetailResponse } from './generate/pb';

export type DocumentDetailData = DetailResponse & {
  children?: DocumentDetailData[];
  level?: string;
};

export function arrayToTree(
  arr: DocumentDetailData[],
  parent = 'root',
  field = 'id',
  parentLevel?: string
): DocumentDetailData[] {
  return _.chain(arr)
    .filter(item => item.parent === parent)
    .map(child => {
      const level = `${parentLevel ? parentLevel + '.' : ''}${child.index + 1}`;
      return {
        ...child,
        level,
        children: arrayToTree(arr, (child as any)[field], field, level)
      };
    })
    .sortBy('index')
    .value();
}

export function flatTree(arr: DocumentDetailData[]): DocumentDetailData[] {
  const getMembers = (member: DocumentDetailData): any => {
    if (!member.children || !member.children.length) {
      return {
        ...member,
        hasChild: false
      };
    }
    return [
      {
        ...member,
        hasChild: true
      },
      _.flatMapDeep(member.children, getMembers)
    ];
  };

  return _.chain(arr).flatMapDeep(getMembers).sortBy('level').value();
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

export function formatDate(value: string) {
  return DateTime.fromJSDate(new Date(Date.parse(value))).toFormat(
    'HH:mm dd/MM/yyyy'
  );
}
