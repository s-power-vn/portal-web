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
};

function mergeNodes<T>(
  items: TreeData<T>[],
  arrayFields: string[] = []
): TreeData<T>[] {
  return _.chain(items)
    .groupBy('level')
    .map(group => {
      const first = group[0];
      if (group.length === 1) return first;

      // Create a merged node starting with the first item
      const mergedNode = { ...first };
      const commonFields = ['group', 'level', 'parent', 'hasChild', 'children'];

      // Process each field that should be an array
      arrayFields.forEach(field => {
        const parts = field.split('.');

        // Collect all values for this field
        const values = group
          .map(item => {
            const value = parts.reduce((acc, part) => acc?.[part], item as any);
            return value;
          })
          .filter(v => v !== undefined);

        if (values.length > 0) {
          if (parts.length === 1) {
            // Root level field - use uniq for primitive values
            (mergedNode as any)[field] = _.uniq(values);
          } else {
            // Nested field
            const lastPart = parts.pop()!;
            const target = parts.reduce((acc, part) => {
              if (!acc[part]) acc[part] = {};
              return acc[part];
            }, mergedNode as any);

            // For nested objects, use uniqBy with all fields
            if (values.every(v => typeof v === 'object' && !Array.isArray(v))) {
              const allKeys = _.uniq(values.flatMap(obj => Object.keys(obj)));
              target[lastPart] = _.uniqBy(values, item =>
                allKeys.map(key => item[key]).join('|')
              );
            } else {
              // For mixed values or arrays, flatten and remove duplicates
              target[lastPart] = _.uniq(_.flattenDeep(values));
            }
          }
        }
      });

      return mergedNode;
    })
    .value();
}

export function arrayToTree<T>(
  arr: TreeData<T>[],
  parent: string,
  arrayFields: string[] = []
): TreeData<T>[] {
  // First merge nodes with same level
  const mergedArr = mergeNodes(arr, arrayFields);

  // Then build tree from merged nodes
  return _.chain(mergedArr)
    .filter(item => item.parent === parent)
    .map(child => {
      const children = arrayToTree(mergedArr, child.group, arrayFields);
      return {
        ...child,
        children: children.length > 0 ? children : undefined,
        hasChild: children.length > 0
      };
    })
    .sortBy('level')
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

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
