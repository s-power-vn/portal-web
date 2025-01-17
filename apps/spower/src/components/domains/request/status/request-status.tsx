import { Loader } from 'lucide-react';
import { api } from 'portal-api';
import { RequestStatusOptions } from 'portal-core';

import type { FC } from 'react';
import React, { Suspense, useCallback } from 'react';

import { Match, Switch, cn } from '@minhdtb/storeo-core';
import { Button, showModal } from '@minhdtb/storeo-theme';

import { AStateFlow } from './a-state/a-state-flow';

export type RequestStatusProps = {
  issueId: string;
  className?: string;
};

const Component: FC<RequestStatusProps> = ({ issueId, className }) => {
  const request = api.request.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const handleClick = useCallback(() => {
    showModal({
      title: `Trạng thái công việc - ${request.data?.status}`,
      className: 'min-w-[800px]',
      children: (
        <div className={'h-[400px]'}>
          <AStateFlow status={request.data?.status} />
        </div>
      )
    });
  }, [request.data?.status]);

  const style = `text-appWhite flex w-fit h-fit items-center
  justify-center whitespace-nowrap rounded-full px-2 py-1 text-xs`;

  return (
    <Switch
      fallback={
        <span className={cn(style, 'bg-appGrayDark text-appBlack', className)}>
          Không xác định
        </span>
      }
    >
      <Match when={request.data?.status?.charAt(0) === 'A'}>
        <Button
          variant={'outline'}
          onClick={handleClick}
          className={cn(
            style,
            request.data?.status === RequestStatusOptions.A8
              ? 'bg-appGrayLight text-appBlack'
              : 'bg-appError',
            className
          )}
        >
          {request.data?.status === RequestStatusOptions.A8
            ? 'Kết thúc'
            : request.data?.status}
        </Button>
      </Match>
    </Switch>
  );
};

export const RequestStatus: FC<RequestStatusProps> = props => {
  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <Component {...props}></Component>
    </Suspense>
  );
};
