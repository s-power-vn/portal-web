import { FC } from 'react';

import {
  DatePicker,
  NumericInput,
  SelectInput,
  TextInput
} from '@minhdtb/storeo-theme';

import { SelectEmployee } from '../../../employee';
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
        <NumericInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      );
    case 'employee':
      return (
        <SelectEmployee
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      );
    default:
      return (
        <TextInput
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
        />
      );
  }
};
