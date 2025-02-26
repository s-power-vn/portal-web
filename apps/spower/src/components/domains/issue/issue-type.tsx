import { Loader } from 'lucide-react';
import { api } from 'portal-api';
import { ObjectTypeOptions } from 'portal-core';

import { FC, Suspense } from 'react';

import { Match, Switch, cn } from '@minhdtb/storeo-core';

export type IssueTypeProps = {
  issueId: string;
  className?: string;
};

const Component: FC<IssueTypeProps> = ({ issueId, className }) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const style = 'rounded-full px-2 py-1 text-xs text-white';

  return (
    <div className={'flex items-center whitespace-nowrap'}>
      <Switch
        fallback={
          <span className={cn(style, 'bg-gray-500', className)}>
            Không xác định
          </span>
        }
      >
        <Match
          when={issue.data.expand?.object.type === ObjectTypeOptions.Request}
        >
          <span className={cn(style, 'bg-red-500', className)}>
            Yêu cầu mua hàng
          </span>
        </Match>
        <Match
          when={issue.data.expand?.object.type === ObjectTypeOptions.Price}
        >
          <span className={cn(style, 'bg-blue-500', className)}>Báo giá</span>
        </Match>
        <Match when={issue.data.expand?.object.type === ObjectTypeOptions.Task}>
          <span className={cn(style, 'bg-green-500', className)}>
            Công việc
          </span>
        </Match>
        <Match
          when={issue.data.expand?.object.type === ObjectTypeOptions.Document}
        >
          <span className={cn(style, 'bg-purple-500', className)}>
            Tài liệu
          </span>
        </Match>
      </Switch>
    </div>
  );
};

export const IssueType: FC<IssueTypeProps> = props => {
  return (
    <Suspense fallback={<Loader className={'h-4 w-4 animate-spin'} />}>
      <Component {...props} />
    </Suspense>
  );
};
