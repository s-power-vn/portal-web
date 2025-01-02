import { SelectInput, SelectInputProps } from '@minhdtb/storeo-theme';
import _ from 'lodash';

import { FC, useMemo } from 'react';

import { departmentApi } from '../../../api';

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
