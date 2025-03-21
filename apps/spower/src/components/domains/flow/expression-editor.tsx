import { PlusCircle, Trash2 } from 'lucide-react';

import { FC, useState } from 'react';

import { Button, DatePicker, SelectInput, error } from '@minhdtb/storeo-theme';

// Define types for expressions
type ObjectType = 'issue' | 'request' | 'price';
type PropertyType = 'string' | 'number' | 'date' | 'boolean';
type OperatorType = '=' | '<>' | '>' | '<' | '>=' | '<=' | 'in';

// Available objects
const objectOptions = [
  { label: 'Issue', value: 'issue', group: 'Objects' },
  { label: 'Request', value: 'request', group: 'Objects' },
  { label: 'Price', value: 'price', group: 'Objects' }
];

// Properties for each object type
const propertyOptions: Record<
  ObjectType,
  { label: string; value: string; type: PropertyType; group: string }[]
> = {
  issue: [
    { label: 'ID', value: 'id', type: 'string', group: 'Issue Properties' },
    {
      label: 'Title',
      value: 'title',
      type: 'string',
      group: 'Issue Properties'
    },
    {
      label: 'Status',
      value: 'status',
      type: 'string',
      group: 'Issue Properties'
    },
    {
      label: 'Assignee',
      value: 'assignee',
      type: 'string',
      group: 'Issue Properties'
    },
    {
      label: 'Priority',
      value: 'priority',
      type: 'number',
      group: 'Issue Properties'
    },
    {
      label: 'Due Date',
      value: 'dueDate',
      type: 'date',
      group: 'Issue Properties'
    }
  ],
  request: [
    { label: 'ID', value: 'id', type: 'string', group: 'Request Properties' },
    {
      label: 'Type',
      value: 'type',
      type: 'string',
      group: 'Request Properties'
    },
    {
      label: 'Status',
      value: 'status',
      type: 'string',
      group: 'Request Properties'
    },
    {
      label: 'Amount',
      value: 'amount',
      type: 'number',
      group: 'Request Properties'
    },
    {
      label: 'Created Date',
      value: 'createdDate',
      type: 'date',
      group: 'Request Properties'
    }
  ],
  price: [
    { label: 'ID', value: 'id', type: 'string', group: 'Price Properties' },
    { label: 'Name', value: 'name', type: 'string', group: 'Price Properties' },
    {
      label: 'Value',
      value: 'value',
      type: 'number',
      group: 'Price Properties'
    },
    {
      label: 'Currency',
      value: 'currency',
      type: 'string',
      group: 'Price Properties'
    },
    {
      label: 'Active',
      value: 'active',
      type: 'boolean',
      group: 'Price Properties'
    }
  ]
};

// Operators for each property type
const operatorOptions: Record<
  PropertyType,
  { label: string; value: OperatorType; group?: string }[]
> = {
  string: [
    { label: '=', value: '=' },
    { label: '<>', value: '<>' }
  ],
  number: [
    { label: '=', value: '=' },
    { label: '<>', value: '<>' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' }
  ],
  date: [
    { label: '=', value: '=' },
    { label: '<>', value: '<>' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: 'IN', value: 'in' }
  ],
  boolean: [{ label: '=', value: '=' }]
};

// Define a row expression type
type ExpressionRow = {
  id: string;
  objectType: ObjectType | '';
  property: string;
  propertyType: PropertyType | '';
  operator: OperatorType | '';
  value: string | number | boolean | Date | null;
  fromDate?: Date | null;
  toDate?: Date | null;
};

// Function to create an empty expression row
const createEmptyRow = (): ExpressionRow => ({
  id: Math.random().toString(36).substring(2, 9),
  objectType: '',
  property: '',
  propertyType: '',
  operator: '',
  value: null,
  fromDate: null,
  toDate: null
});

// Function to convert expressions to JavaScript conditions
const expressionsToCondition = (rows: ExpressionRow[]): string => {
  if (rows.length === 0) return '';

  return rows
    .filter(
      row =>
        row.objectType &&
        row.property &&
        row.operator &&
        (row.value !== null ||
          (row.operator === 'in' && row.fromDate && row.toDate))
    )
    .map(row => {
      const {
        objectType,
        property,
        operator,
        value,
        propertyType,
        fromDate,
        toDate
      } = row;

      // Handle date range for "in" operator
      if (propertyType === 'date' && operator === 'in' && fromDate && toDate) {
        return `${objectType}.${property} > "${fromDate.toISOString()}" && ${objectType}.${property} < "${toDate.toISOString()}"`;
      }

      // Format value based on property type
      let formattedValue = value;
      if (propertyType === 'string') {
        formattedValue = `"${value}"`;
      } else if (propertyType === 'date' && value instanceof Date) {
        formattedValue = `"${value.toISOString()}"`;
      }

      return `${objectType}.${property} ${operator} ${formattedValue}`;
    })
    .join(' && ');
};

type ExpressionEditorProps = {
  value?: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
};

export const ExpressionEditor: FC<ExpressionEditorProps> = ({
  value = '',
  onSubmit,
  onClose
}) => {
  // Define state for expression rows
  const [rows, setRows] = useState<ExpressionRow[]>(() => {
    // Try to parse the existing expression if there is one
    if (value && value.trim()) {
      try {
        // Simple parsing for expressions joined by && (AND)
        const expressionParts = value.split('&&').map(part => part.trim());

        // Check for date range expressions (propertyName > date1 && propertyName < date2)
        const rows: ExpressionRow[] = [];
        const processedIndices = new Set<number>();

        // First pass: find date range expressions
        for (let i = 0; i < expressionParts.length; i++) {
          if (processedIndices.has(i)) continue;

          const part = expressionParts[i];
          const greaterThanMatch = part.match(/^(\w+)\.(\w+)\s*>\s*"([^"]+)"/);

          if (greaterThanMatch && i + 1 < expressionParts.length) {
            const nextPart = expressionParts[i + 1];
            const lessThanMatch = nextPart.match(
              /^(\w+)\.(\w+)\s*<\s*"([^"]+)"/
            );

            // If we have both parts of a date range expression
            if (
              lessThanMatch &&
              greaterThanMatch[1] === lessThanMatch[1] && // Same object
              greaterThanMatch[2] === lessThanMatch[2]
            ) {
              // Same property

              const objectType = greaterThanMatch[1] as ObjectType;
              const property = greaterThanMatch[2];
              const fromDateStr = greaterThanMatch[3];
              const toDateStr = lessThanMatch[3];

              // Find the property type
              const propertyDef = propertyOptions[objectType]?.find(
                p => p.value === property
              );

              if (propertyDef?.type === 'date') {
                try {
                  const fromDate = new Date(fromDateStr);
                  const toDate = new Date(toDateStr);

                  rows.push({
                    id: Math.random().toString(36).substring(2, 9),
                    objectType,
                    property,
                    propertyType: 'date',
                    operator: 'in',
                    value: null,
                    fromDate,
                    toDate
                  });

                  // Mark both parts as processed
                  processedIndices.add(i);
                  processedIndices.add(i + 1);
                } catch (e) {
                  console.error('Failed to parse date range:', e);
                }
              }
            }
          }
        }

        // Second pass: handle remaining expressions
        expressionParts.forEach((part, index) => {
          if (processedIndices.has(index)) return;

          // Try to extract object.property operator value
          const objectPropertyMatch = part.match(/^(\w+)\.(\w+)/);
          const operatorMatch = part.match(/[=<>!]+|in/);

          if (objectPropertyMatch && operatorMatch) {
            const objectType = objectPropertyMatch[1] as ObjectType;
            const property = objectPropertyMatch[2];
            const operator = operatorMatch[0] as OperatorType;

            // Find the property in our schema
            const propertyDef = propertyOptions[objectType]?.find(
              p => p.value === property
            );
            const propertyType = propertyDef?.type || '';

            // Extract value after the operator
            const valueStart = part.indexOf(operator) + operator.length;
            let valueStr = part.substring(valueStart).trim();

            // Handle quoted strings
            if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
              valueStr = valueStr.substring(1, valueStr.length - 1);
            }

            // Parse value based on property type
            let parsedValue: any = null;
            if (propertyType === 'number') {
              parsedValue = parseFloat(valueStr);
            } else if (propertyType === 'boolean') {
              parsedValue = valueStr === 'true';
            } else if (propertyType === 'date') {
              try {
                parsedValue = new Date(valueStr);
              } catch (e) {
                parsedValue = null;
              }
            } else {
              parsedValue = valueStr;
            }

            rows.push({
              id: Math.random().toString(36).substring(2, 9),
              objectType,
              property,
              propertyType,
              operator,
              value: parsedValue,
              fromDate: null,
              toDate: null
            });
          } else {
            rows.push(createEmptyRow());
          }
        });

        return rows.length > 0 ? rows : [createEmptyRow()];
      } catch (err) {
        error('Lỗi khi phân tích biểu thức');
      }
    }

    // Default to a single empty row
    return [createEmptyRow()];
  });

  // Add a new row
  const handleAddRow = () => {
    setRows(prev => [...prev, createEmptyRow()]);
  };

  // Remove a row
  const handleRemoveRow = (id: string) => {
    setRows(prev => prev.filter(row => row.id !== id));
  };

  // Update row values
  const handleUpdateRow = (
    id: string,
    field: keyof ExpressionRow,
    value: any
  ) => {
    setRows(prev =>
      prev.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };

          // Reset dependent fields when changing object or property
          if (field === 'objectType') {
            updatedRow.property = '';
            updatedRow.propertyType = '';
            updatedRow.operator = '';
            updatedRow.value = null;
            updatedRow.fromDate = null;
            updatedRow.toDate = null;
          } else if (field === 'property') {
            const selectedProperty = propertyOptions[
              row.objectType as ObjectType
            ]?.find(p => p.value === value);
            updatedRow.propertyType = selectedProperty?.type || '';
            updatedRow.operator = '';
            updatedRow.value = null;
            updatedRow.fromDate = null;
            updatedRow.toDate = null;
          } else if (field === 'operator') {
            updatedRow.value = null;
            updatedRow.fromDate = null;
            updatedRow.toDate = null;
          }

          return updatedRow;
        }
        return row;
      })
    );
  };

  // Handle submission
  const handleSubmit = () => {
    const condition = expressionsToCondition(rows);
    onSubmit(condition);
  };

  return (
    <div className="flex h-[400px] flex-col gap-4">
      <div className="flex-1 overflow-y-auto">
        {rows.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Nhấn nút "Thêm biểu thức" để bắt đầu
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map(row => (
              <div key={row.id} className="flex flex-wrap items-center gap-2">
                {/* Object Selection */}
                <div className="w-52">
                  <SelectInput
                    value={row.objectType}
                    onChange={value =>
                      handleUpdateRow(row.id, 'objectType', value as string)
                    }
                    items={objectOptions}
                    placeholder="Đối tượng"
                    showGroups={false}
                  />
                </div>

                {/* Property Selection - Only show if object is selected */}
                {row.objectType && (
                  <div className="w-56">
                    <SelectInput
                      value={row.property}
                      onChange={value =>
                        handleUpdateRow(row.id, 'property', value as string)
                      }
                      items={propertyOptions[row.objectType as ObjectType].map(
                        p => ({
                          label: p.label,
                          value: p.value,
                          group: p.group
                        })
                      )}
                      placeholder="Thuộc tính"
                      showGroups={false}
                    />
                  </div>
                )}

                {/* Operator Selection - Only show if property is selected */}
                {row.property && row.propertyType && (
                  <div className="w-36">
                    <SelectInput
                      value={row.operator}
                      onChange={value =>
                        handleUpdateRow(row.id, 'operator', value as string)
                      }
                      items={operatorOptions[
                        row.propertyType as PropertyType
                      ].map(o => ({
                        label: o.label,
                        value: o.value,
                        group: o.group
                      }))}
                      placeholder="Toán tử"
                      showGroups={false}
                    />
                  </div>
                )}

                {/* Value Input - Only show if operator is selected */}
                {row.operator && (
                  <div className="min-w-[200px] flex-1">
                    {row.propertyType === 'date' && row.operator === 'in' ? (
                      <div className="flex items-center gap-2">
                        <DatePicker
                          placeholder="Từ ngày..."
                          value={row.fromDate || undefined}
                          className="w-full"
                          onChange={date =>
                            handleUpdateRow(row.id, 'fromDate', date)
                          }
                        />
                        <span className="whitespace-nowrap text-xs font-medium">
                          -
                        </span>
                        <DatePicker
                          placeholder="Đến ngày..."
                          value={row.toDate || undefined}
                          className="w-full"
                          onChange={date =>
                            handleUpdateRow(row.id, 'toDate', date)
                          }
                        />
                      </div>
                    ) : row.propertyType === 'date' ? (
                      <DatePicker
                        placeholder="Chọn ngày..."
                        value={(row.value as Date) || undefined}
                        className="w-full"
                        onChange={date =>
                          handleUpdateRow(row.id, 'value', date)
                        }
                      />
                    ) : row.propertyType === 'number' ? (
                      <input
                        type="number"
                        className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
                        value={(row.value as number) || ''}
                        onChange={e =>
                          handleUpdateRow(
                            row.id,
                            'value',
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    ) : row.propertyType === 'boolean' ? (
                      <SelectInput
                        value={row.value?.toString() || ''}
                        onChange={value =>
                          handleUpdateRow(row.id, 'value', value === 'true')
                        }
                        items={[
                          {
                            label: 'True',
                            value: 'true'
                          },
                          {
                            label: 'False',
                            value: 'false'
                          }
                        ]}
                        placeholder="Giá trị"
                        showGroups={false}
                      />
                    ) : (
                      <input
                        type="text"
                        className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
                        value={(row.value as string) || ''}
                        onChange={e =>
                          handleUpdateRow(row.id, 'value', e.target.value)
                        }
                      />
                    )}
                  </div>
                )}

                {/* Remove Row Button */}
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRow(row.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Row Button */}
      <Button
        variant="outline"
        onClick={handleAddRow}
        className="w-full justify-center"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Thêm biểu thức
      </Button>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button onClick={handleSubmit}>Xác nhận</Button>
      </div>
    </div>
  );
};
