import { Loader } from 'lucide-react';

import { FC, Suspense } from 'react';

import { IssueTypeOptions, Match, Switch } from '@storeo/core';

import { issueApi } from '../../../api/issue';
import { RequestDetail } from '../request/request-detail';

export type IssueDetailProps = {
  issueId: string;
};

export const IssueDetail: FC<IssueDetailProps> = ({ issueId }) => {
  const issue = issueApi.byId.useSuspenseQuery({
    variables: issueId
  });

  return (
    <Switch
      fallback={
        <div className={`p-2`}>
          <Loader className={'h-6 w-6 animate-spin'} />
        </div>
      }
    >
      <Match when={issue.data.type === IssueTypeOptions.Request}>
        <Suspense>
          <RequestDetail issueId={issueId} />
        </Suspense>
      </Match>
    </Switch>
  );
};
