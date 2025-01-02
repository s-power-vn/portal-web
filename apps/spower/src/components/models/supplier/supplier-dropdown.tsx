import _ from 'lodash';
import { supplierApi } from 'portal-api';

import { FC } from 'react';

import { SelectInput, SelectInputProps } from '@minhdtb/storeo-theme';

export type SupplierDropdownProps = Omit<SelectInputProps, 'items'>;

export const SupplierDropdown: FC<SupplierDropdownProps> = ({ ...props }) => {
  const listSuppliers = supplierApi.listFull.useQuery();

  const items = _.map(listSuppliers.data, ({ id, name }) => ({
    value: id,
    label: name
  }));

  return <SelectInput items={items} {...props} />;
};
