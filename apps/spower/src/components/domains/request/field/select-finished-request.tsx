import { api } from 'portal-api';

import { FC } from 'react';

import { Combobox } from '../../../combobox';
import { getDoneFlows } from '../../../flow';

export type SelectFinishedRequestProps = {
  projectId?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export const SelectFinishedRequest: FC<SelectFinishedRequestProps> = ({
  projectId,
  value,
  onChange,
  className
}) => {
  const allDones = getDoneFlows('request');

  return (
    <Combobox
      value={value}
      onChange={onChange}
      placeholder="Chọn yêu cầu mua hàng"
      emptyText="Không tìm thấy yêu cầu mua hàng"
      queryKey={['request-finished']}
      queryFn={async ({ search, page }) => {
        const result = await api.request.listFinished.fetcher({
          projectId: projectId ?? '',
          filter: search,
          pageIndex: page,
          pageSize: 10,
          statuses: allDones.map(it => it.id)
        });

        return {
          items: result.items.map(it => ({
            label: it.expand.issue.title,
            value: it.id,
            group: it.expand.issue.id
          })),
          hasMore: result.page < result.totalPages
        };
      }}
      showGroups={false}
      className={className}
    />
  );
};
