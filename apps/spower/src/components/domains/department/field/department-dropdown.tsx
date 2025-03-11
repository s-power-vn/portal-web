import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type DepartmentDropdownProps = Partial<ComboboxProps>;

export const DepartmentDropdown: FC<DepartmentDropdownProps> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn phòng ban"
      emptyText="Không tìm thấy phòng ban"
      queryKey={['departments']}
      queryFn={async ({ search, page }) => {
        const result = await api.department.list.fetcher({
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
      multiple={props.multiple}
    />
  );
};
