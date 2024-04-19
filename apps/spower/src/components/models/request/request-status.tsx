import { useSuspenseQuery } from '@tanstack/react-query';

import { FC, Suspense } from 'react';

import {
  Match,
  RequestStatusOptions,
  Show,
  Switch,
  client,
  cn
} from '@storeo/core';

import { RequestData } from '../../../api';

export type RequestStatusProps = {
  issueId: string;
  className?: string;
};

const Component: FC<RequestStatusProps> = ({ issueId, className }) => {
  const request = useSuspenseQuery({
    queryKey: ['getRequest', issueId],
    queryFn: () =>
      client
        .collection<RequestData>('request')
        .getFirstListItem(`issue = "${issueId}"`, {
          expand: 'issue'
        })
  });

  return (
    <Switch fallback={<span>Không xác định</span>}>
      <Match when={request.data.status === RequestStatusOptions.ToDo}>
        <Show
          when={
            client.authStore.model?.role === 1 &&
            client.authStore.model?.id === request.data.expand.issue.assignee
          }
          fallback={
            <span
              className={cn(
                'text-appWhite rounded-full bg-red-500 px-2 py-1 text-xs shadow',
                className
              )}
            >
              Đang xử lý khối lượng
            </span>
          }
        >
          <span
            className={cn(
              'text-appWhite rounded-full bg-red-500 px-2 py-1 text-xs shadow',
              className
            )}
          >
            Chờ duyệt khối lượng
          </span>
        </Show>
      </Match>
      <Match when={request.data.status === RequestStatusOptions.VolumeDone}>
        <Show
          when={
            client.authStore.model?.role === 1 &&
            client.authStore.model?.id === request.data.expand.issue.assignee
          }
          fallback={
            <span
              className={cn(
                'text-appWhite rounded-full bg-orange-500 px-2 py-1 text-xs shadow',
                className
              )}
            >
              Đang xử lý giá
            </span>
          }
        >
          <span
            className={cn(
              'text-appWhite rounded-full bg-orange-500 px-2 py-1 text-xs shadow',
              className
            )}
          >
            Chờ duyệt giá
          </span>
        </Show>
      </Match>
      <Match when={request.data.status === RequestStatusOptions.Done}>
        <span
          className={cn(
            'text-appWhite rounded-full bg-blue-500 px-2 py-1 text-xs shadow',
            className
          )}
        >
          Đã duyệt
        </span>
      </Match>
    </Switch>
  );
};

export const RequestStatus: FC<RequestStatusProps> = props => {
  return (
    <Suspense fallback={<span className={'text-xs'}>Loading...</span>}>
      <Component {...props}></Component>
    </Suspense>
  );
};
