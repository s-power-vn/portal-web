import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox, ComboboxProps } from '../../combobox';

export type CustomerDropdownProps = Partial<ComboboxProps>;

export const CustomerDropdown: FC<CustomerDropdownProps> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn chủ đầu tư"
      emptyText="Không tìm thấy chủ đầu tư"
      queryKey={['customers']}
      queryFn={async ({ search, page }) => {
        const result = await api.customer.list.fetcher({
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
    />
  );
};
