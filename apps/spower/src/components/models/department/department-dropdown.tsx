import _ from 'lodash';

import { FC, useMemo } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

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
