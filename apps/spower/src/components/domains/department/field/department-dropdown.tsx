import _ from 'lodash';
import { api } from 'portal-api';

import type { FC } from 'react';
import { useMemo } from 'react';

import type { SelectInputProps } from '@minhdtb/storeo-theme';
import { SelectInput } from '@minhdtb/storeo-theme';

export type DepartmentDropdownProps = Omit<SelectInputProps, 'items'>;

export const DepartmentDropdown: FC<DepartmentDropdownProps> = ({
  ...props
}) => {
  const listDepartments = api.department.listFull.useQuery();

  const items = useMemo(
    () =>
      _.map(listDepartments.data, ({ id, name }) => ({
        value: id,
        label: name
      })),
    [listDepartments.data]
  );

  return <SelectInput items={items} {...props} />;
};
