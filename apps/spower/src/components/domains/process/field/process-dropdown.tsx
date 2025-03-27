import { api } from 'portal-api';

import { FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type ProcessDropdownProps = Partial<ComboboxProps>;

export const ProcessDropdown: FC<ProcessDropdownProps> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.process.byIds.fetcher(ids)
      : await api.process.byId.fetcher(ids);
    return Array.isArray(result)
      ? result.map(it => ({
          label: it.name || '',
          value: it.id
        }))
      : {
          label: result.name || '',
          value: result.id
        };
  }, []);

  const queryFn = useCallback(
    async ({ search, page }: { search?: string; page?: number }) => {
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
    },
    []
  );

  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn quy trình'}
      emptyText={props.emptyText ?? 'Không tìm thấy quy trình'}
      queryKey={api.process.list.getKey()}
      queryFn={queryFn}
      lookupFn={lookupFn}
    />
  );
};
