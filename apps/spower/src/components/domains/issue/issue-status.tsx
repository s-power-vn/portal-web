import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import React, { Suspense, useCallback, useMemo } from 'react';

import { Match, Switch, cn } from '@minhdtb/storeo-core';
import { Button, showModal } from '@minhdtb/storeo-theme';

import processData from '../../../process.json';
import { ProcessFlow, extractStatus } from '../../flow/process-flow';

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

  const node = useMemo(() => {
    return processData.request.nodes.find(it => {
      const extracted = extractStatus(issue.data.status);
      const currentNode = extracted?.to ? extracted.to : extracted?.from;
      return it.id === currentNode;
    });
  }, [issue.data.status]);

  return (
    <Switch
      fallback={
        <span className={cn(style, 'bg-appGrayDark text-appBlack', className)}>
          Không xác định
        </span>
      }
    >
      <Match when={!!node}>
        <Button
          variant={'outline'}
          onClick={handleClick}
          className={cn(style, 'bg-appError', className)}
        >
          {node?.name}
        </Button>
      </Match>
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
