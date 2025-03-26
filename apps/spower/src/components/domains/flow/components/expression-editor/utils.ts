import { error } from '@minhdtb/storeo-theme';

import {
  ExpressionRowData,
  OperatorType,
  PropertyType,
  PropertyVariable
} from './types';

export const createEmptyRow = (): ExpressionRowData => ({
  id: Math.random().toString(36).substring(2, 9),
  property: '',
  propertyType: '',
  operator: '',
  value: null,
  fromDate: null,
  toDate: null
});

const detectPropertyType = (value: string): PropertyType => {
  // Remove quotes if present
  const cleanValue =
    value.startsWith('"') && value.endsWith('"')
      ? value.substring(1, value.length - 1)
      : value;

  // Check for ISO date format
  if (cleanValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/)) {
    try {
      const date = new Date(cleanValue);
      if (!isNaN(date.getTime())) {
        return 'datetime';
      }
    } catch (e) {
      // Not a valid date, continue to other checks
    }
  }

  // Check for boolean
  if (cleanValue === 'true' || cleanValue === 'false') {
    return 'boolean';
  }

  // Check for number
  if (!isNaN(Number(cleanValue))) {
    return 'number';
  }

  // Default to string
  return 'string';
};

export const formatExpressionValue = (
  value: any,
  type: PropertyType,
  operator?: OperatorType
): string => {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'employee':
      if (operator === 'in' && Array.isArray(value)) {
        return `"${value.join(',')}"`;
      }
      return `"${value}"`;
    case 'string':
      return `"${value}"`;
    case 'datetime':
      return value instanceof Date ? `"${value.toISOString()}"` : `"${value}"`;
    case 'boolean':
    case 'number':
      return String(value);
    default:
      return value;
  }
};

export const expressionsToCondition = (
  rows: ExpressionRowData[],
  objectType: string
): string => {
  if (rows.length === 0) return '';

  return rows
    .filter(row => {
      // Nếu không có property hoặc operator thì loại bỏ
      if (!row.property || !row.operator) return false;

      // Nếu là datetime với operator 'in' thì cần có fromDate và toDate
      if (row.propertyType === 'datetime' && row.operator === 'in') {
        return row.fromDate && row.toDate;
      }

      // Các trường hợp khác chỉ cần có value
      return row.value !== null && row.value !== undefined;
    })
    .map(row => {
      const { property, operator, value, propertyType, fromDate, toDate } = row;

      // Handle date range for "in" operator
      if (
        propertyType === 'datetime' &&
        operator === 'in' &&
        fromDate &&
        toDate
      ) {
        return `${objectType}.${property} > "${fromDate.toISOString()}" && ${objectType}.${property} < "${toDate.toISOString()}"`;
      }

      return `${objectType}.${property} ${operator} ${formatExpressionValue(
        value,
        propertyType as PropertyType,
        operator as OperatorType
      )}`;
    })
    .join(' && ');
};

export const parseCondition = (
  condition: string,
  objectType: string,
  variables: PropertyVariable[]
): ExpressionRowData[] => {
  if (!condition) return [createEmptyRow()];

  const rows: ExpressionRowData[] = [];
  const processedIndices = new Set<number>();

  // Split by && and trim whitespace
  const expressionParts = condition.split('&&').map(part => part.trim());

  // First pass: handle date ranges
  expressionParts.forEach((part, index) => {
    if (part.includes(' > "') && index + 1 < expressionParts.length) {
      const nextPart = expressionParts[index + 1];
      if (nextPart.includes(' < "')) {
        try {
          const property = part.match(
            new RegExp(`${objectType}\\.(\\w+)`)
          )?.[1];
          const fromDate = new Date(part.match(/> "([^"]+)"/)?.[1] || '');
          const toDate = new Date(nextPart.match(/< "([^"]+)"/)?.[1] || '');

          if (property && fromDate && toDate) {
            const propertyType =
              variables.find(v => v.name === property)?.type || 'datetime';
            rows.push({
              id: Math.random().toString(36).substring(2, 9),
              property,
              propertyType,
              operator: 'in',
              value: null,
              fromDate,
              toDate
            });
            processedIndices.add(index);
            processedIndices.add(index + 1);
          }
        } catch (e) {
          error(
            `Lỗi khi phân tích khoảng thời gian: ${e instanceof Error ? e.message : String(e)}`
          );
        }
      }
    }
  });

  // Second pass: handle remaining expressions
  expressionParts.forEach((part, index) => {
    if (processedIndices.has(index)) return;

    // Improved regex to capture operator correctly
    const objectPropertyMatch = part.match(
      new RegExp(`${objectType}\\.(\\w+)\\s*([=<>]+|in)\\s*(.+)`)
    );

    if (objectPropertyMatch) {
      const [, property, operator, valueStr] = objectPropertyMatch;
      let parsedValue = valueStr.trim();

      // Get property type from variables
      const propertyType =
        variables.find(v => v.name === property)?.type || 'string';

      // Remove quotes if present
      if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
        parsedValue = parsedValue.substring(1, parsedValue.length - 1);
      }

      // Convert value based on type and operator
      let value: any = parsedValue;
      if (propertyType === 'datetime') {
        value = new Date(parsedValue);
      } else if (propertyType === 'boolean') {
        value = parsedValue === 'true';
      } else if (propertyType === 'number') {
        value = Number(parsedValue);
      } else if (propertyType === 'employee' && operator.trim() === 'in') {
        value = parsedValue.split(',').map(v => v.trim());
      }

      rows.push({
        id: Math.random().toString(36).substring(2, 9),
        property,
        propertyType,
        operator: operator.trim() as OperatorType,
        value,
        fromDate: null,
        toDate: null
      });
    }
  });

  return rows.length > 0 ? rows : [createEmptyRow()];
};
