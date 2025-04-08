import { api } from 'portal-api';

import { type FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../combobox';

export type SelectEmployeeProps = Partial<ComboboxProps>;

export const SelectEmployee: FC<SelectEmployeeProps> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.employee.byIds.fetcher(ids)
      : await api.employee.byId.fetcher(ids);
    return Array.isArray(result)
      ? result.map(it => ({
          label: it.name ? it.name : it.user?.name || '',
          value: it.user?.id || ''
        }))
      : {
          label: result.name ? result.name : result.user?.name || '',
          value: result.user?.id || ''
        };
  }, []);

  const queryFn = useCallback(
    async ({ search, page }: { search?: string; page?: number }) => {
      const result = await api.employee.list.fetcher({
        filter: `name ~ "${search ?? ''}" || email ~ "${search ?? ''}"`,
        pageIndex: page ?? 1,
        pageSize: 10
      });

      return {
        items: result.items.map(it => ({
          label: it.name ? it.name : it.user?.name || '',
          value: it.user?.id || '',
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
      queryKey={['employees']}
      queryFn={queryFn}
      lookupFn={lookupFn}
    />
  );
};
