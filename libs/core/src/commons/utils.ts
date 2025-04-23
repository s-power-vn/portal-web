import type { Column } from '@tanstack/react-table';

import type { CSSProperties } from 'react';

export interface BaseData {
  id: string;
  level: string;
  parent_id?: string | null;
}

export type TreeData<T extends BaseData> = T & {
  children?: TreeData<T>[];
};

export function arrayToTree<T extends BaseData>(array: T[]): TreeData<T>[] {
  const map = array.reduce((acc, item) => {
    const pid = item.parent_id || 'root';
    if (!acc.has(pid)) {
      acc.set(pid, []);
    }
    acc.get(pid)?.push(item);
    return acc;
  }, new Map<string, T[]>());

  const buildTree = (pid = 'root'): TreeData<T>[] => {
    const items = map.get(pid) || [];
    return items.map(item => {
      const children = buildTree(item.id);
      if (children.length > 0) {
        return { ...item, children };
      }
      return item;
    });
  };

  return buildTree();
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

    if (isV1Letter && !isV2Letter) return 1;
    if (!isV1Letter && isV2Letter) return -1;

    if (isV1Letter && isV2Letter) {
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
      continue;
    }

    const num1 = parseInt(v1Part, 10);
    const num2 = parseInt(v2Part, 10);

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
