import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import React, { Suspense, useCallback } from 'react';

import { Switch, cn } from '@minhdtb/storeo-core';
import { showModal } from '@minhdtb/storeo-theme';

import { ProcessFlow } from '../../flow/process-flow';

export type IssueStatusProps = {
  issueId: string;
  className?: string;
};

const Component: FC<IssueStatusProps> = ({ issueId, className }) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const handleClick = useCallback(() => {
    showModal({
      title: `Trạng thái công việc`,
      className: 'min-w-[800px]',
      children: (
        <div className={'h-[400px]'}>
          <ProcessFlow status={issue.data.status} />
        </div>
      )
    });
  }, [issue.data.status]);

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

export const IssueStatus: FC<IssueStatusProps> = props => {
  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <Component {...props}></Component>
    </Suspense>
  );
};
