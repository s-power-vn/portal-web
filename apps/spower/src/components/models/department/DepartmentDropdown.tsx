import { queryOptions, useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import PocketBase from 'pocketbase';

import { FC } from 'react';

import { DepartmentResponse, usePb } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

function getDepartments(pb?: PocketBase) {
  return pb?.collection('department').getFullList<DepartmentResponse>();
}

function departmentsOptions(pb?: PocketBase) {
  return queryOptions({
    queryKey: ['departments'],
    queryFn: () => getDepartments(pb)
  });
}

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
