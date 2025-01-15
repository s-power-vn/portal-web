import { IssueDeadlineStatusOptions } from 'portal-core';

import type { FC } from 'react';

import { cn } from '@minhdtb/storeo-core';

export type DeadlineStatusProps = {
  status?: IssueDeadlineStatusOptions;
  className?: string;
};

export const DeadlineStatus: FC<DeadlineStatusProps> = props => {
  return props.status === IssueDeadlineStatusOptions.Normal ? (
    <div
      className={cn(
        'bg-appSuccess flex w-fit items-center justify-center rounded-full px-2 py-1 text-xs text-white',
        props.className
      )}
    >
      An toàn
    </div>
  ) : props.status === IssueDeadlineStatusOptions.Warning ? (
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
