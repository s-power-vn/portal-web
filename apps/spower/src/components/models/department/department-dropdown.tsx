import _ from 'lodash';

import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { departmentApi } from '../../../api';

export type DepartmentDropdownProps = Omit<SelectInputProps, 'items'>;

export const DepartmentDropdown: FC<DepartmentDropdownProps> = ({
  ...props
}) => {
  const listDepartments = departmentApi.listFull.useQuery();

  const items = _.map(listDepartments.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
