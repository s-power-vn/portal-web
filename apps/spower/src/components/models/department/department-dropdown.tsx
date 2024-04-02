import { queryOptions, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

import { FC } from 'react';

import { DepartmentResponse, client } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

function getDepartments() {
  return client.collection('department').getFullList<DepartmentResponse>();
}

function departmentsOptions() {
  return queryOptions({
    queryKey: ['departments'],
    queryFn: getDepartments
  });
}

export type DepartmentDropdownProps = Omit<SelectInputProps, 'items'>;

export const DepartmentDropdown: FC<DepartmentDropdownProps> = ({
  ...props
}) => {
  const query = useQuery(departmentsOptions());

  const items = _.map(query.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
