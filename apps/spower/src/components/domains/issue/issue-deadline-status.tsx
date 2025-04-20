import { Loader } from 'lucide-react';
import { api } from 'portal-api';

import type { FC } from 'react';
import { Suspense } from 'react';

import { cn } from '@minhdtb/storeo-core';

export type IssueDeadlineStatusProps = {
  issueId: string;
  className?: string;
};

const DeadlineStatusComponent: FC<IssueDeadlineStatusProps> = props => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: props.issueId
  });

  return issue.data.deadlineStatus === 'Normal' ? (
    <div
      className={cn(
        'bg-appSuccess flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs text-white',
        props.className
      )}
    >
      An toàn
    </div>
  ) : issue.data.deadlineStatus === 'Warning' ? (
    <div
      className={cn(
        'bg-appWarning flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs',
        props.className
      )}
    >
      Nguy cơ chậm
    </div>
  ) : (
    <div
      className={cn(
        'bg-appError flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs text-white',
        props.className
      )}
    >
      Đang chậm
    </div>
  );
};

export const IssueDeadlineStatus: FC<IssueDeadlineStatusProps> = props => {
  return (
    <Suspense
      fallback={
        <div className="w-fit px-2 py-1">
          <Loader className={'h-3 w-3 animate-spin'} />
        </div>
      }
    >
      <DeadlineStatusComponent {...props} />
    </Suspense>
  );
};
