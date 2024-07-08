import { Cross2Icon } from '@radix-ui/react-icons';

import React, { FC, Suspense, useCallback, useState } from 'react';

import { Match, Show, Switch, cn } from '@storeo/core';
import { Button } from '@storeo/theme';

import { requestApi } from '../../../../api';
import { AStateFlow } from './a-state/a-state-flow';

export type RequestStatusProps = {
  issueId: string;
  className?: string;
};

const Component: FC<RequestStatusProps> = ({ issueId, className }) => {
  const [showGraph, setShowGraph] = useState(false);

  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setShowGraph(true);
    },
    []
  );

  const style = `text-appWhite flex w-fit h-fit items-center
  justify-center whitespace-nowrap rounded-full px-2 py-1 text-xs shadow`;

  return (
    <>
      <Show when={showGraph}>
        <div
          className={`absolute left-1/2 top-1/2 z-50
                -translate-x-1/2 -translate-y-1/2
                  transform rounded border bg-white shadow-lg`}
        >
          <div className={'relative h-[600px] w-[800px]'}>
            <AStateFlow status={request.data.status} />
            <Button
              className={'absolute right-2 top-2 h-8 w-8 rounded-full p-0'}
              onClick={e => {
                e.stopPropagation();
                setShowGraph(false);
              }}
            >
              <Cross2Icon />
            </Button>
          </div>
        </div>
      </Show>
      <Switch
        fallback={
          <span
            className={cn(style, 'bg-appGrayDark text-appBlack', className)}
          >
            Không xác định
          </span>
        }
      >
        <Match when={request.data.status?.charAt(0) === 'A'}>
          <Button
            variant={'outline'}
            onClick={handleClick}
            className={cn(style, 'bg-appError', className)}
          >
            {request.data.status}
          </Button>
        </Match>
      </Switch>
    </>
  );
};

export const RequestStatus: FC<RequestStatusProps> = props => {
  return (
    <Suspense fallback={<span className={'text-xs'}>Loading...</span>}>
      <Component {...props}></Component>
    </Suspense>
  );
};
