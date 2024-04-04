import { queryOptions, useQuery } from '@tanstack/react-query';
import _ from 'lodash';

import { FC } from 'react';

import { SupplierResponse, client } from '@storeo/core';
import { SelectInput, SelectInputProps } from '@storeo/theme';

function suppliersOptions() {
  return queryOptions({
    queryKey: ['getSuppliers'],
    queryFn: () => client.collection<SupplierResponse>('supplier').getFullList()
  });
}

export type SupplierDropdownProps = Omit<SelectInputProps, 'items'>;

export const SupplierDropdown: FC<SupplierDropdownProps> = ({ ...props }) => {
  const query = useQuery(suppliersOptions());

  const items = _.map(query.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
