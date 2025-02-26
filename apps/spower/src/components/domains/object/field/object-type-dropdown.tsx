import { ObjectTypeOptions } from 'portal-core';

import type { FC } from 'react';
import { useMemo } from 'react';

import type { SelectInputProps } from '@minhdtb/storeo-theme';
import { SelectInput } from '@minhdtb/storeo-theme';

export type ObjectTypeDropdownProps = Omit<SelectInputProps, 'items'>;

export const ObjectTypeDropdown: FC<ObjectTypeDropdownProps> = ({
  ...props
}) => {
  const items = useMemo(
    () => [
      {
        value: ObjectTypeOptions.Request,
        label: 'Yêu cầu'
      },
      {
        value: ObjectTypeOptions.Price,
        label: 'Báo giá'
      },
      {
        value: ObjectTypeOptions.Task,
        label: 'Công việc'
      },
      {
        value: ObjectTypeOptions.Document,
        label: 'Tài liệu'
      }
    ],
    []
  );

  return <SelectInput items={items} {...props} />;
};
