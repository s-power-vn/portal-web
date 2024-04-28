import { useSuspenseQuery } from '@tanstack/react-query';

import { FC, Suspense } from 'react';

import { IssueTypeOptions, Match, Switch, client } from '@storeo/core';

import { RequestDetail } from '../request/request-detail';

export type IssueDetailProps = {
  issueId: string;
};

export const IssueDetail: FC<IssueDetailProps> = ({ issueId }) => {
  const issue = useSuspenseQuery({
    queryKey: ['issue', issueId],
    queryFn: () => client.collection('issue').getOne(issueId)
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
