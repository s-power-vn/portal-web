import { ExpressionRowData, OperatorType, PropertyType } from './types';

export const createEmptyRow = (): ExpressionRowData => ({
  id: Math.random().toString(36).substring(2, 9),
  property: '',
  propertyType: '',
  operator: '',
  value: null,
  fromDate: null,
  toDate: null
});

export const formatExpressionValue = (
  value: any,
  type: PropertyType
): string => {
  if (value === null || value === undefined) return '';

  switch (type) {
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
    .filter(
      row =>
        row.property &&
        row.operator &&
        (row.value !== null ||
          (row.operator === 'in' && row.fromDate && row.toDate))
    )
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
        propertyType as PropertyType
      )}`;
    })
    .join(' && ');
};

export const parseCondition = (
  condition: string,
  objectType: string
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
            rows.push({
              id: Math.random().toString(36).substring(2, 9),
              property,
              propertyType: 'datetime',
              operator: 'in',
              value: null,
              fromDate,
              toDate
            });
            processedIndices.add(index);
            processedIndices.add(index + 1);
          }
        } catch (e) {
          console.error('Error parsing date range:', e);
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

      // Remove quotes if present
      if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
        parsedValue = parsedValue.substring(1, parsedValue.length - 1);
      }

      // Try to parse date if the value looks like an ISO date string
      if (
        parsedValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/)
      ) {
        try {
          const date = new Date(parsedValue);
          if (!isNaN(date.getTime())) {
            rows.push({
              id: Math.random().toString(36).substring(2, 9),
              property,
              propertyType: 'datetime',
              operator: operator.trim() as OperatorType,
              value: date,
              fromDate: null,
              toDate: null
            });
            return;
          }
        } catch (e) {
          console.error('Error parsing date:', e);
        }
      }

      rows.push({
        id: Math.random().toString(36).substring(2, 9),
        property,
        propertyType: '', // This will be set by the component based on variables
        operator: operator.trim() as OperatorType,
        value: parsedValue,
        fromDate: null,
        toDate: null
      });
    }
  });

  return rows.length > 0 ? rows : [createEmptyRow()];
};
