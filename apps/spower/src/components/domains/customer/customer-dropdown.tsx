import _ from 'lodash';
import { api } from 'portal-api';

import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@minhdtb/storeo-theme';

export type CustomerDropdownProps = Omit<SelectInputProps, 'items'>;

export const CustomerDropdown: FC<CustomerDropdownProps> = ({ ...props }) => {
  const listCustomers = api.customer.listFull.useQuery();

  const items = _.map(listCustomers.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} showSearch={true} {...props} />;
};