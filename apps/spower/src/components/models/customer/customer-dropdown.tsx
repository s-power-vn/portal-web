import _ from 'lodash';

import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { useGetAllCustomers } from '../../../api';

export type CustomerDropdownProps = Omit<SelectInputProps, 'items'>;

export const CustomerDropdown: FC<CustomerDropdownProps> = ({ ...props }) => {
  const customersQuery = useGetAllCustomers();

  const items = _.map(customersQuery.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} showSearch={true} {...props} />;
};
