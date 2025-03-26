import { Trash2 } from 'lucide-react';

import { FC, useCallback, useMemo } from 'react';

import { Match, Switch } from '@minhdtb/storeo-core';
import { DatePicker, SelectInput } from '@minhdtb/storeo-theme';

import { SelectEmployee } from '../../../employee';
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

  const handlePropertyChange = useCallback(
    (value: string | string[] | undefined) => {
      if (typeof value === 'string') {
        const selectedProperty = variables.find(v => v.name === value);
        if (selectedProperty) {
          onUpdate(row.id, 'property', value);
          onUpdate(row.id, 'propertyType', selectedProperty.type);
        }
      } else {
        onUpdate(row.id, 'property', '');
        onUpdate(row.id, 'propertyType', '');
      }
    },
    [variables, onUpdate, row.id]
  );

  const operatorOptions = useMemo(() => {
    if (row.property && !row.propertyType) {
      const selectedProperty = variables.find(v => v.name === row.property);
      if (selectedProperty?.type) {
        return OPERATOR_OPTIONS[selectedProperty.type].map(op => ({
          value: op.value,
          label: op.label
        }));
      }
    }
    if (row.propertyType) {
      return OPERATOR_OPTIONS[row.propertyType].map(op => ({
        value: op.value,
        label: op.label
      }));
    }
    return [];
  }, [row.property, row.propertyType, variables]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[1fr_125px_2fr_auto] gap-4">
        {/* Property Field */}
        <div className="flex flex-col gap-1">
          <SelectInput<SelectItem>
            placeholder="Chọn thuộc tính"
            items={propertyOptions}
            value={row.property}
            onChange={handlePropertyChange}
          />
          {errors.property && (
            <div className="text-xs text-red-500">{errors.property}</div>
          )}
        </div>
        {/* Operator Field */}
        <div className="flex flex-col gap-1">
          {row.property && (
            <>
              <SelectInput<SelectItem>
                placeholder="Chọn toán tử"
                items={operatorOptions}
                value={row.operator}
                onChange={value => onUpdate(row.id, 'operator', value)}
              />
              {errors.operator && (
                <div className="text-xs text-red-500">{errors.operator}</div>
              )}
            </>
          )}
        </div>

        {/* Value Field */}
        <div className="flex flex-col gap-1">
          <Switch
            fallback={
              <>
                <ValueInput
                  type={row.propertyType as PropertyType}
                  value={row.value}
                  onChange={value => onUpdate(row.id, 'value', value)}
                />
                {errors.value && (
                  <div className="text-xs text-red-500">{errors.value}</div>
                )}
              </>
            }
          >
            <Match
              when={
                row.operator &&
                row.operator === 'in' &&
                row.propertyType === 'datetime'
              }
            >
              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <DatePicker
                    placeholder="Từ ngày"
                    value={row.fromDate || undefined}
                    onChange={(date: Date | null | undefined) =>
                      onUpdate(row.id, 'fromDate', date)
                    }
                  />
                  {errors.fromDate && (
                    <div className="text-xs text-red-500">
                      {errors.fromDate}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <DatePicker
                    placeholder="Đến ngày"
                    value={row.toDate || undefined}
                    onChange={(date: Date | null | undefined) =>
                      onUpdate(row.id, 'toDate', date)
                    }
                  />
                  {errors.toDate && (
                    <div className="text-xs text-red-500">{errors.toDate}</div>
                  )}
                </div>
              </div>
            </Match>
            <Match
              when={
                row.operator &&
                row.operator === 'in' &&
                row.propertyType === 'employee'
              }
            >
              <div className="flex flex-col gap-1">
                <SelectEmployee
                  value={row.value as string[]}
                  onChange={value => onUpdate(row.id, 'value', value)}
                  multiple
                />
                {errors.value && (
                  <div className="text-xs text-red-500">{errors.value}</div>
                )}
              </div>
            </Match>
          </Switch>
        </div>

        {/* Remove Button */}
        <div className="flex items-center">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => onRemove(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
