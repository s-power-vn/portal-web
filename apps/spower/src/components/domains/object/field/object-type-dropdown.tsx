import { api } from 'portal-api';

import { type FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type ObjectTypeDropdownProps = Partial<ComboboxProps>;

export const ObjectTypeDropdown: FC<ObjectTypeDropdownProps> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.objectType.byIds.fetcher(ids)
      : await api.objectType.byId.fetcher(ids);
    return Array.isArray(result)
      ? result.map(it => ({
          label: it.display || '',
          value: it.id
        }))
      : {
          label: result.display || '',
          value: result.id
        };
  }, []);

  const queryFn = useCallback(
    async ({ search, page }: { search?: string; page?: number }) => {
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
    },
    []
  );

  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn loại đối tượng'}
      emptyText={props.emptyText ?? 'Không tìm thấy loại đối tượng'}
      queryKey={['objectTypes']}
      queryFn={queryFn}
      lookupFn={lookupFn}
    />
  );
};
