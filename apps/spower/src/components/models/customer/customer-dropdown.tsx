import _ from 'lodash';

import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { customerApi } from '../../../api';

export type CustomerDropdownProps = Omit<SelectInputProps, 'items'>;

export const CustomerDropdown: FC<CustomerDropdownProps> = ({ ...props }) => {
  const listCustomers = customerApi.listFull.useQuery();

  const items = _.map(listCustomers.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} showSearch={true} {...props} />;
};
