import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type SupplierDropdownProps = Partial<ComboboxProps>;

export const SupplierDropdown: FC<SupplierDropdownProps> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn nhà cung cấp"
      emptyText="Không tìm thấy nhà cung cấp"
      queryKey={['suppliers']}
      queryFn={async ({ search, page }) => {
        const result = await api.supplier.list.fetcher({
          filter: search ?? '',
          pageIndex: page ?? 1,
          pageSize: 10
        });

        return {
          items: result.items.map(it => ({
            label: it.name,
            value: it.id
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      className={props.className}
      showGroups={false}
      multiple={props.multiple || true}
    />
  );
};
