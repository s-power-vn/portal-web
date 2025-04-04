import { api } from 'portal-api';

import { type FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../../../../components';

export type SupplierDropdownProps = Partial<ComboboxProps>;

export const SupplierDropdown: FC<SupplierDropdownProps> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.supplier.byIds.fetcher(ids)
      : await api.supplier.byId.fetcher(ids);
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
      const result = await api.supplier.list.fetcher({
        filter: search ? `name.ilike.%${search}%` : '',
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
      placeholder={props.placeholder ?? 'Chọn nhà cung cấp'}
      emptyText={props.emptyText ?? 'Không tìm thấy nhà cung cấp'}
      queryKey={['suppliers']}
      queryFn={queryFn}
      lookupFn={lookupFn}
    />
  );
};
