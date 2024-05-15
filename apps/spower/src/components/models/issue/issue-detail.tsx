import { FC, Suspense } from 'react';

import { IssueTypeOptions, Match, Switch } from '@storeo/core';

import { RequestDetail } from '../request/request-detail';
import { issueApi } from '../../../api/issue';

export type IssueDetailProps = {
  issueId: string;
};

export const IssueDetail: FC<IssueDetailProps> = ({ issueId }) => {
  const issue = issueApi.byId.useSuspenseQuery({
    variables: issueId
  });

  return (
    <Switch fallback={'Đang tải...'}>
      <Match when={issue.data.type === IssueTypeOptions.Request}>
        <Suspense>
          <RequestDetail issueId={issueId} />
        </Suspense>
      </Match>
    </Switch>
  );
};
