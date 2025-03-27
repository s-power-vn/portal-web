import { api } from 'portal-api';

import { type FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../combobox';

export type CustomerDropdownProps = Partial<ComboboxProps>;

export const CustomerDropdown: FC<CustomerDropdownProps> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.customer.byIds.fetcher(ids)
      : await api.customer.byId.fetcher(ids);
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
    },
    []
  );

  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn chủ đầu tư'}
      emptyText={props.emptyText ?? 'Không tìm thấy chủ đầu tư'}
      queryKey={api.customer.list.getKey()}
      queryFn={queryFn}
      lookupFn={lookupFn}
    />
  );
};
