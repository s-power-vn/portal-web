import { FC, Suspense } from 'react';

import {
  Match,
  RequestStatusOptions,
  Show,
  Switch,
  client,
  cn
} from '@storeo/core';

import { requestApi } from '../../../api';

export type RequestStatusProps = {
  issueId: string;
  className?: string;
};

const Component: FC<RequestStatusProps> = ({ issueId, className }) => {
  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const style = `text-appWhite flex w-fit h-fit items-center
  justify-center whitespace-nowrap rounded-full px-2 py-1 text-xs shadow`;

  return (
    <Switch fallback={<span>Không xác định</span>}>
      <Match when={request.data.status === RequestStatusOptions.ToDo}>
        <Show
          when={
            client.authStore.model?.role === 1 &&
            client.authStore.model?.id === request.data.expand.issue.assignee
          }
          fallback={
            <span className={cn(style, 'bg-appError', className)}>
              Đang xử lý khối lượng
            </span>
          }
        >
          <span className={cn(style, 'bg-appError', className)}>
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
              className={cn(style, 'bg-appWarning text-appBlack', className)}
            >
              Đang xử lý giá
            </span>
          }
        >
          <span className={cn(style, 'bg-appWarning text-appBlack', className)}>
            Chờ duyệt giá
          </span>
        </Show>
      </Match>
      <Match when={request.data.status === RequestStatusOptions.Done}>
        <span className={cn(style, 'bg-appSuccess', className)}>Đã duyệt</span>
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
