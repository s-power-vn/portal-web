import { api } from 'portal-api';

import type { FC } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type ObjectTypeDropdownProps = Partial<ComboboxProps>;

export const ObjectTypeDropdown: FC<ObjectTypeDropdownProps> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn loại đối tượng"
      emptyText="Không tìm thấy loại đối tượng"
      queryKey={['objectTypes']}
      queryFn={async ({ search, page }) => {
        const result = await api.objectType.list.fetcher({
          filter: search ?? '',
          pageIndex: page ?? 1,
          pageSize: 10
        });

        return {
          items: result.items.map(type => ({
            label: type.display || '',
            value: type.id,
            subLabel: '',
            group: ''
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
