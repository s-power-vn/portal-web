import { queryOptions, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

import { FC } from 'react';

import { CustomerResponse, client } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

function customersOptions() {
  return queryOptions({
    queryKey: ['getCustomers'],
    queryFn: () => client.collection<CustomerResponse>('customer').getFullList()
  });
}

export type CustomerDropdownProps = Omit<SelectInputProps, 'items'>;

export const CustomerDropdown: FC<CustomerDropdownProps> = ({ ...props }) => {
  const query = useQuery(customersOptions());

  const items = _.map(query.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} showSearch={true} {...props} />;
};
