import { FC } from 'react';

import { SelectInput } from '@minhdtb/storeo-theme';

import { FlowType } from './types';

const selectItems = [
  {
    label: 'Mặc định',
    value: 'default'
  },
  {
    label: 'Thẳng',
    value: 'straight'
  },
  {
    label: 'Bậc thang',
    value: 'step'
  },
  {
    label: 'Bậc thang mượt',
    value: 'smoothstep'
  }
];

export type SelectFlowTypeProps = {
  value?: FlowType;
  onChange?: (value: FlowType) => void;
};

export const SelectFlowType: FC<SelectFlowTypeProps> = ({
  value,
  onChange
}) => {
  console.log(value, selectItems);
  return (
    <SelectInput
      value={value}
      onChange={value => {
        onChange?.(value as FlowType);
      }}
      items={selectItems}
    />
  );
};
