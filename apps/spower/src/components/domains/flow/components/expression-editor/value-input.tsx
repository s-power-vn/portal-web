import { FC } from 'react';

import { DatePicker, SelectInput } from '@minhdtb/storeo-theme';

import { ValueInputProps } from './types';

export const ValueInput: FC<ValueInputProps> = ({
  type,
  value,
  onChange,
  placeholder = 'Nhập giá trị...'
}) => {
  switch (type) {
    case 'datetime':
      return (
        <DatePicker
          placeholder={placeholder}
          value={value || undefined}
          className="w-full"
          onChange={onChange}
        />
      );
    case 'boolean':
      return (
        <SelectInput
          value={String(value)}
          onChange={value => onChange(value === 'true')}
          items={[
            { label: 'Đúng', value: 'true' },
            { label: 'Sai', value: 'false' }
          ]}
          placeholder={placeholder}
        />
      );
    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={e =>
            onChange(e.target.value ? Number(e.target.value) : null)
          }
          placeholder={placeholder}
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
        />
      );
    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value || null)}
          placeholder={placeholder}
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
        />
      );
  }
};
