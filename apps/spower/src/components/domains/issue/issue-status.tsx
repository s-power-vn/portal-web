import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import { Suspense, useCallback, useMemo } from 'react';

import { Match, Switch, cn } from '@minhdtb/storeo-core';
import { Button, showModal } from '@minhdtb/storeo-theme';

import { ProcessData, ProcessFlow, extractStatus, getNode } from '../flow';

export type IssueStatusProps = {
  issueId: string;
  className?: string;
};

const Component: FC<IssueStatusProps> = ({ issueId, className }) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const process = api.process.byType.useSuspenseQuery({
    variables: issue.data.expand?.type.id
  });

  const handleClick = useCallback(() => {
    showModal({
      title: `Trạng thái công việc`,
      className: 'min-w-[800px]',
      children: (
        <div className={'h-[400px]'}>
          <ProcessFlow
            processData={process.data.process as ProcessData}
            status={issue.data.status}
          />
        </div>
      )
    });
  }, [issue.data.status]);

  const style = `text-appWhite flex w-fit h-fit items-center
  justify-center whitespace-nowrap rounded-full px-2 py-1 text-xs`;

  const currentNode = useMemo(() => {
    const extracted = extractStatus(issue.data.status);
    const currentNode = extracted?.to ? extracted.to : extracted?.from;
    return currentNode
      ? getNode(process.data.process as ProcessData, currentNode)
      : undefined;
  }, [issue.data.status]);

  return (
    <Switch
      fallback={
        <span className={cn(style, 'bg-appGrayDark text-appBlack', className)}>
          Không xác định
        </span>
      }
    >
      <Match when={!!currentNode}>
        <Button
          variant={'outline'}
          onClick={handleClick}
          className={cn(style, 'bg-appError', className)}
        >
          {currentNode?.name}
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
