import { api } from 'portal-api';

import { FC } from 'react';

import { Combobox, ComboboxProps } from '../../../combobox';

export type SelectFinishedRequestProps = Partial<ComboboxProps> & {
  projectId?: string;
};

export const SelectFinishedRequest: FC<SelectFinishedRequestProps> = props => {
  return (
    <Combobox
      {...props}
      placeholder={props.placeholder ?? 'Chọn yêu cầu mua hàng'}
      emptyText={props.emptyText ?? 'Không tìm thấy yêu cầu mua hàng'}
      queryKey={['request-finished']}
      queryFn={async ({ search, page }) => {
        if (!props.projectId) {
          return {
            items: [],
            hasMore: false
          };
        }

        const result = await api.request.listFinished.fetcher({
          projectId: props.projectId,
          pageIndex: page ?? 1,
          pageSize: 10
        });

        return {
          items: result.items.map(it => ({
            label: it.expand?.issue.title ?? '',
            value: it.request
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      showGroups={false}
    />
  );
};
