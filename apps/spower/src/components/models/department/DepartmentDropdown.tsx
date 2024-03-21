import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

import { FC } from 'react';

import { usePb } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

import { departmentsOptions } from '../../../api';

export type DepartmentDropdownProps = Omit<SelectInputProps, 'items'>;

export const DepartmentDropdown: FC<DepartmentDropdownProps> = ({
  ...props
}) => {
  const pb = usePb();
  const query = useQuery(departmentsOptions(pb));

  const items = _.map(query.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
