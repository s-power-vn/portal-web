import { queryOptions, useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import PocketBase from 'pocketbase';

import { FC } from 'react';

import { CustomerResponse, usePb } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

function getCustomers(pb?: PocketBase) {
  return pb?.collection('customer').getFullList<CustomerResponse>();
}

function customersOptions(pb?: PocketBase) {
  return queryOptions({
    queryKey: ['customers'],
    queryFn: () => getCustomers(pb)
  });
}

export type CustomerDropdownProps = Omit<SelectInputProps, 'items'>;

export const CustomerDropdown: FC<CustomerDropdownProps> = ({ ...props }) => {
  const pb = usePb();
  const query = useQuery(customersOptions(pb));

  const items = _.map(query.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
