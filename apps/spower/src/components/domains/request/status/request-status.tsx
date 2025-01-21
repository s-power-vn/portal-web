import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import React, { Suspense, useCallback } from 'react';

import { Switch, cn } from '@minhdtb/storeo-core';
import { showModal } from '@minhdtb/storeo-theme';

import { ProcessFlow } from '../../../flow/process-flow';

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
      title: `Trạng thái công việc`,
      className: 'min-w-[800px]',
      children: (
        <div className={'h-[400px]'}>
          <ProcessFlow status={'n1-n2#1'} />
        </div>
      )
    });
  }, []);

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
      <></>
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
