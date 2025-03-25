import { Trash2 } from 'lucide-react';

import { FC, useMemo } from 'react';

import { DatePicker, SelectInput } from '@minhdtb/storeo-theme';

import { OPERATOR_OPTIONS } from './constants';
import { ExpressionRowProps, PropertyType } from './types';
import { ValueInput } from './value-input';

type SelectItem = {
  value: string;
  label: string;
  type?: PropertyType;
};

export const ExpressionRow: FC<ExpressionRowProps> = ({
  row,
  variables,
  errors = {},
  onUpdate,
  onRemove
}) => {
  const propertyOptions = useMemo(
    () =>
      variables.map(variable => ({
        value: variable.name,
        label: variable.display,
        type: variable.type
      })),
    [variables]
  );

  const handlePropertyChange = (value: string | string[] | undefined) => {
    if (typeof value === 'string') {
      const selectedProperty = variables.find(v => v.name === value);
      if (selectedProperty) {
        onUpdate(row.id, 'property', value);
        onUpdate(row.id, 'propertyType', selectedProperty.type);
      }
    }
  };

  const operatorOptions = useMemo(() => {
    if (!row.propertyType) return [];
    return OPERATOR_OPTIONS[row.propertyType as PropertyType].map(op => ({
      value: op.value,
      label: op.label
    }));
  }, [row.propertyType]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex flex-col gap-1">
            <SelectInput<SelectItem>
              placeholder="Chọn thuộc tính"
              items={propertyOptions}
              value={row.property}
              onChange={handlePropertyChange}
            />
            {errors.property && (
              <div className="text-sm text-red-500">{errors.property}</div>
            )}
          </div>
        </div>
        {row.property && (
          <div className="flex-1">
            <div className="flex flex-col gap-1">
              <SelectInput<SelectItem>
                placeholder="Chọn toán tử"
                items={operatorOptions}
                value={row.operator}
                onChange={value => onUpdate(row.id, 'operator', value)}
              />
              {errors.operator && (
                <div className="text-sm text-red-500">{errors.operator}</div>
              )}
            </div>
          </div>
        )}
        {row.operator && (
          <div className="flex-1">
            {row.operator === 'in' && row.propertyType === 'datetime' ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <DatePicker
                      placeholder="Từ ngày"
                      value={row.fromDate || undefined}
                      onChange={(date: Date | null | undefined) =>
                        onUpdate(row.id, 'fromDate', date)
                      }
                    />
                    {errors.fromDate && (
                      <div className="text-sm text-red-500">
                        {errors.fromDate}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <DatePicker
                      placeholder="Đến ngày"
                      value={row.toDate || undefined}
                      onChange={(date: Date | null | undefined) =>
                        onUpdate(row.id, 'toDate', date)
                      }
                    />
                    {errors.toDate && (
                      <div className="text-sm text-red-500">
                        {errors.toDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <ValueInput
                  type={row.propertyType as PropertyType}
                  value={row.value}
                  onChange={value => onUpdate(row.id, 'value', value)}
                />
                {errors.value && (
                  <div className="text-sm text-red-500">{errors.value}</div>
                )}
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          className="mt-2 text-gray-500 hover:text-gray-700"
          onClick={() => onRemove(row.id)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
