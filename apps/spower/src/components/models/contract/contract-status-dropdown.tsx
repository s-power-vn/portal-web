import { FC } from 'react';

import { cn } from '@storeo/core';
import { SelectInput } from '@storeo/theme';

const items = [
  {
    value: 'ToDo',
    label: 'Chưa xong'
  },
  {
    value: 'Done',
    label: 'Đã xong'
  }
];

export type ContractStatusDropdownProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
};

export const ContractStatusDropdown: FC<ContractStatusDropdownProps> = ({
  value = 'ToDo',
  onChange
}) => {
  return (
    <SelectInput
      items={items}
      className={cn(
        'w-36 border-0 shadow',
        value === 'ToDo'
          ? 'bg-orange-300 hover:bg-orange-400'
          : 'bg-green-300 hover:bg-green-400'
      )}
      value={value}
      onChange={onChange}
    />
  );
};
