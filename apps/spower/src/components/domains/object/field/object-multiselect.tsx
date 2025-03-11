import { api } from 'portal-api';

import { FC } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type ObjectMultiselectProps = Partial<ComboboxProps>;

export const ObjectMultiselect: FC<ObjectMultiselectProps> = props => {
  return (
    <Combobox
      value={props.value}
      onChange={props.onChange}
      placeholder="Chọn đối tượng"
      emptyText="Không tìm thấy đối tượng"
      queryKey={['objects']}
      queryFn={async ({ search, page }) => {
        const result = await api.object.list.fetcher({
          filter: search ?? '',
          pageIndex: page ?? 1,
          pageSize: 10
        });

        return {
          items: result.items.map(object => ({
            label: object.name,
            value: object.id,
            subLabel: object.process !== '' ? 'Đã áp dụng' : '',
            group: object.expand?.type?.display || ''
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      className={props.className}
      showGroups={true}
      multiple={true}
    />
  );
};
