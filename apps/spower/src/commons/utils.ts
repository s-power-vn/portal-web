import { Column } from '@tanstack/react-table';
import _ from 'lodash';

import { CSSProperties } from 'react';

export type TreeData<T> = T & {
  group: string;
  index: number;
  parent: string;
  level?: string;
  hasChild?: boolean;
  children?: TreeData<T>[];
  rowSpan?: number;
};

export function arrayToTree<T>(
  arr: TreeData<T>[],
  parent: string,
  parentLevel?: string
): TreeData<T>[] {
  return _.chain(arr)
    .filter(item => item.parent === parent)
    .map(child => {
      const level = `${parentLevel ? parentLevel + '.' : ''}${child.index + 1}`;
      return {
        ...child,
        level,
        children: arrayToTree(arr, child.group, level)
      };
    })
    .sortBy('index')
    .value();
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
