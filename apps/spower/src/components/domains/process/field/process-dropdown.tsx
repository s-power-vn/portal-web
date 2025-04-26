import { processApi } from 'portal-api';

import { FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type ProcessDropdownProps = Partial<ComboboxProps> & {
  objectType?: string;
};

export const ProcessDropdown: FC<ProcessDropdownProps> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await processApi.byIds.fetcher(ids)
      : await processApi.byId.fetcher(ids);
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
      console.log(props.objectType);
      const result = await processApi.listByType.fetcher({
        filter: search ?? '',
        pageIndex: page ?? 1,
        pageSize: 10,
        objectType: props.objectType
      });

      return {
        items: result.items.map(it => ({
          label: it.name || '',
          value: it.id
        })),
        hasMore: result.page < result.totalPages
      };
    },
    [props.objectType]
  );

  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn quy trình'}
      emptyText={props.emptyText ?? 'Không tìm thấy quy trình'}
      queryKey={processApi.listByType.getKey({ objectType: props.objectType })}
      queryFn={queryFn}
      lookupFn={lookupFn}
      showGroups={false}
    />
  );
};
