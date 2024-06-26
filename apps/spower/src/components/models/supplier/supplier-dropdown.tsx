import _ from 'lodash';

import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@storeo/theme';

import { supplierApi } from '../../../api';

export type SupplierDropdownProps = Omit<SelectInputProps, 'items'>;

export const SupplierDropdown: FC<SupplierDropdownProps> = ({ ...props }) => {
  const listSuppliers = supplierApi.listFull.useQuery();

  const items = _.map(listSuppliers.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
