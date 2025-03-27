import { api } from 'portal-api';

import { type FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type DepartmentDropdownProps = Partial<ComboboxProps>;

export const DepartmentDropdown: FC<DepartmentDropdownProps> = props => {
  console.log('props', props);

  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.department.byIds.fetcher(ids)
      : await api.department.byId.fetcher(ids);
    return Array.isArray(result)
      ? result.map(it => ({
          label: it.name,
          value: it.id
        }))
      : {
          label: result.name,
          value: result.id
        };
  }, []);

  const queryFn = useCallback(
    async ({ search, page }: { search?: string; page?: number }) => {
      console.log('search', search);
      console.log('page', page);

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
    },
    []
  );

  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn phòng ban'}
      emptyText={props.emptyText ?? 'Không tìm thấy phòng ban'}
      queryKey={['departments']}
      queryFn={queryFn}
      lookupFn={lookupFn}
      showGroups={false}
    />
  );
};
