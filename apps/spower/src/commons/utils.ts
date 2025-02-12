import type { Column } from '@tanstack/react-table';
import _ from 'lodash';

import type { CSSProperties } from 'react';

export type TreeData<T> = T & {
  group: string;
  level: string;
  parent?: string;
  request?: string;
  hasChild?: boolean;
  children?: TreeData<T>[];
  extra?: number | string;
  levelRowSpan?: number;
  requestRowSpan?: number;
};

function makeLevelSpans<T>(data: TreeData<T>[]) {
  const spans: { [key: string]: number } = {};
  data.forEach(d => {
    if (d.level) {
      spans[d.level] = (spans[d.level] || 0) + 1;
    }
  });
  return spans;
}

function makeRequestSpans<T>(data: TreeData<T>[]) {
  const spans: { [key: string]: number } = {};
  data.forEach(d => {
    if (d.request) {
      spans[`${d.request}${d.level}`] =
        (spans[`${d.request}${d.level}`] || 0) + 1;
    }
  });
  return spans;
}

export function arrayToTree<T>(
  arr: TreeData<T>[],
  parent: string,
  extraFunction?: (arr: TreeData<T>[], it: TreeData<T>) => string | number
): TreeData<T>[] {
  const data = _.chain(arr)
    .filter(item => item.parent === parent)
    .map(child => {
      const children = arrayToTree(arr, child.group, extraFunction);
      return {
        ...child,
        children
      };
    })
    .sortBy('level')
    .value();
  const levelSpans = makeLevelSpans(data);
  const requestSpans = makeRequestSpans(data);
  return data.map(it => {
    const lspans = levelSpans[it.level] || 0;
    const rspans = it.request
      ? requestSpans[`${it.request}${it.level}`] || 0
      : 1;
    if (lspans > 0 || rspans > 0) {
      delete levelSpans[it.level];
      if (it.request) {
        delete requestSpans[`${it.request}${it.level}`];
      }
      return {
        ...it,
        levelRowSpan: lspans,
        requestRowSpan: rspans,
        extra: extraFunction?.(data, it)
      };
    } else {
      return it;
    }
  });
}

export function flatTree<T>(arr: TreeData<T>[]): TreeData<T>[] {
  const getMembers = (member: TreeData<T>): TreeData<T>[] => {
    if (!member.children || !member.children.length) {
      return [
        {
          ...member,
          hasChild: false
        }
      ];
    }
    return [
      {
        ...member,
        hasChild: true
      },
      ..._.flatMapDeep(member.children, getMembers)
    ];
  };

  return _.chain(arr).flatMapDeep(getMembers).sortBy('level').value();
}

export function getCommonPinningStyles<T>(column: Column<T>): CSSProperties {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0
  };
}

export function compareVersion(v1: string, v2: string): number {
  if (!v1 || !v2) {
    throw new Error('Version strings cannot be empty');
  }

  // Validate version format using regex - allow numbers and single letters
  const isValidVersion = (v: string) => /^[a-zA-Z\d]+(\.[a-zA-Z\d]+)*$/.test(v);

  if (!isValidVersion(v1) || !isValidVersion(v2)) {
    throw new Error(
      'Invalid version format. Version should only contain numbers, single letters and dots (e.g. "1.0", "2.a.4", "e.3")'
    );
  }

  const v1Parts = v1.split('.');
  const v2Parts = v2.split('.');

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || '0';
    const v2Part = v2Parts[i] || '0';

    const isV1Letter = /^[a-zA-Z]$/.test(v1Part);
    const isV2Letter = /^[a-zA-Z]$/.test(v2Part);

    // If one is letter and other is number
    if (isV1Letter && !isV2Letter) return 1; // letter > number
    if (!isV1Letter && isV2Letter) return -1; // number < letter

    // If both are letters, compare alphabetically
    if (isV1Letter && isV2Letter) {
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
      continue;
    }

    // Both are numbers
    const num1 = parseInt(v1Part, 10);
    const num2 = parseInt(v2Part, 10);

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
