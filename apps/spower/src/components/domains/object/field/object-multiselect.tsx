import { api } from 'portal-api';

import { FC, useCallback } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type ObjectMultiselectProps = Partial<ComboboxProps> & {
  objectType?: string;
};

export const ObjectMultiselect: FC<ObjectMultiselectProps> = props => {
  const lookupFn = useCallback(async (ids: string | string[]) => {
    const result = Array.isArray(ids)
      ? await api.object.byIds.fetcher(ids)
      : await api.object.byId.fetcher(ids);
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
      const filter = props.objectType
        ? `type = '${props.objectType}' ${search ? `&& (name ~ "${search}")` : ''}`
        : search
          ? `(name ~ "${search}")`
          : '';

      const result = await api.object.list.fetcher({
        filter,
        pageIndex: page ?? 1,
        pageSize: 10
      });

      return {
        items: result.items.map(object => ({
          label: object.name,
          value: object.id,
          subLabel: object.process?.name !== '' ? 'Đã áp dụng' : '',
          group: object.objectType?.display || ''
        })),
        hasMore: result.page < result.totalPages
      };
    },
    [props.objectType]
  );

  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn đối tượng'}
      emptyText={props.emptyText ?? 'Không tìm thấy đối tượng'}
      queryKey={['objects']}
      queryFn={queryFn}
      lookupFn={lookupFn}
    />
  );
};
