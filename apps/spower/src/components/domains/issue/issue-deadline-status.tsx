import { api } from 'portal-api';
import { IssueDeadlineStatusOptions } from 'portal-core';

import type { FC } from 'react';

import { cn } from '@minhdtb/storeo-core';

export type IssueDeadlineStatusProps = {
  issueId: string;
  className?: string;
};

export const IssueDeadlineStatus: FC<IssueDeadlineStatusProps> = props => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: props.issueId
  });

  return issue.data.deadlineStatus === IssueDeadlineStatusOptions.Normal ? (
    <div
      className={cn(
        'bg-appSuccess flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs text-white',
        props.className
      )}
    >
      An toàn
    </div>
  ) : issue.data.deadlineStatus === IssueDeadlineStatusOptions.Warning ? (
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
