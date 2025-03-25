import { OperatorType, PropertyType } from './types';

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  datetime: 'Ngày tháng',
  string: 'Chuỗi',
  number: 'Số',
  boolean: 'Boolean'
};

export const OPERATOR_OPTIONS: Record<
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
  datetime: [
    { label: '=', value: '=' },
    { label: '<>', value: '<>' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: 'IN', value: 'in' }
  ],
  boolean: [{ label: '=', value: '=' }]
};
