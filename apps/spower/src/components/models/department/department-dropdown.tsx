import _ from 'lodash';
import { departmentApi } from 'portal-api';

import { FC, useMemo } from 'react';

import { SelectInput, SelectInputProps } from '@minhdtb/storeo-theme';

export type DepartmentDropdownProps = Omit<SelectInputProps, 'items'>;

export const DepartmentDropdown: FC<DepartmentDropdownProps> = ({
  ...props
}) => {
  const listDepartments = departmentApi.listFull.useQuery();

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
