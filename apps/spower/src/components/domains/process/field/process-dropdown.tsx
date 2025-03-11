import { api } from 'portal-api';

import { FC } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type ProcessDropdownProps = Partial<ComboboxProps>;

export const ProcessDropdown: FC<ProcessDropdownProps> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn quy trình"
      emptyText="Không tìm thấy quy trình"
      queryKey={['processes']}
      queryFn={async ({ search, page }) => {
        const result = await api.process.list.fetcher({
          filter: search ?? '',
          pageIndex: page ?? 1,
          pageSize: 10
        });

        return {
          items: result.items.map(it => ({
            label: it.name || '',
            value: it.id
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      className={props.className}
      showGroups={false}
      multiple={props.multiple}
    />
  );
};
