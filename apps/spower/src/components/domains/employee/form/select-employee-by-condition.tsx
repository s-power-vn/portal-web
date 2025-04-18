import { api } from 'portal-api';

import { type FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type SelectEmployeeByConditionProps = Partial<ComboboxProps> & {
  condition?: string;
};

export const SelectEmployeeByCondition: FC<
  SelectEmployeeByConditionProps
> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.employee.byIds.fetcher(ids)
      : await api.employee.byId.fetcher(ids);

    return Array.isArray(result)
      ? result.map(it => ({
          label: it.name ? it.name : it.user?.name || '',
          value: it.id || ''
        }))
      : {
          label: result.name ? result.name : result.user?.name || '',
          value: result.id || ''
        };
  }, []);

  const queryFn = useCallback(
    async ({ search, page }: { search?: string; page?: number }) => {
      const result = await api.employee.list.fetcher({
        filter: search,
        pageIndex: page ?? 1,
        pageSize: 10
      });

      return {
        items: result.items.map(it => ({
          label: it.name ? it.name : it.user?.name || '',
          value: it.id || '',
          group: it.department?.name,
          subLabel: it.user?.email
        })),
        hasMore: result.page < result.totalPages
      };
    },
    []
  );

  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn nhân viên'}
      emptyText={props.emptyText ?? 'Không tìm thấy nhân viên'}
      queryKey={api.employee.list.getKey()}
      queryFn={queryFn}
      lookupFn={lookupFn}
    />
  );
};
