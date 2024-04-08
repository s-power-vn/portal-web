import { Column } from '@tanstack/react-table';
import _ from 'lodash';

import { CSSProperties } from 'react';

import { DetailData } from '../api';

export function arrayToTree(
  arr: DetailData[],
  parent = 'root',
  field = 'id',
  parentLevel?: string
): DetailData[] {
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

export function flatTree(arr: DetailData[]): DetailData[] {
  const getMembers = (member: DetailData): DetailData[] => {
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

export function getCommonPinningStyles(
  column: Column<DetailData>
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
