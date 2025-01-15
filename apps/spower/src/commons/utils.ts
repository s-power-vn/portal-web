import type { Column } from '@tanstack/react-table';
import _ from 'lodash';

import type { CSSProperties } from 'react';

export type TreeData<T> = T & {
  group: string;
  level: string;
  parent: string;
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
