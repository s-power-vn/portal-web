import _ from 'lodash';

import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { useGetAllSuppliers } from '../../../api';

export type SupplierDropdownProps = Omit<SelectInputProps, 'items'>;

export const SupplierDropdown: FC<SupplierDropdownProps> = ({ ...props }) => {
  const suppliersQuery = useGetAllSuppliers();

  const items = _.map(suppliersQuery.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
