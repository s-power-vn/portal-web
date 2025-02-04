import { api } from 'portal-api';
import { IssueDeadlineStatusOptions, IssueTypeOptions } from 'portal-core';

import type { FC } from 'react';
import React from 'react';

import { Match, Switch, cn } from '@minhdtb/storeo-core';

import { Request } from '../request/request';
import { IssueAction } from './issue-action';
import { IssueComment } from './issue-comment';
import { IssueSummary } from './issue-summary';

export type IssueProps = {
  issueId: string;
};

export const Issue: FC<IssueProps> = ({ issueId }) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  return (
    <div
      className={cn(
        ``,
        issue.data.deadlineStatus === IssueDeadlineStatusOptions.Normal
          ? 'border-t-appSuccess border-t-4'
          : issue.data.deadlineStatus === IssueDeadlineStatusOptions.Warning
            ? 'border-t-appWarning border-t-4'
            : 'border-t-appError border-t-4'
      )}
    >
      <IssueSummary issueId={issueId} />
      <Switch fallback={<div className={`p-2`}></div>}>
        <Match when={issue.data.type === IssueTypeOptions.Request}>
          <Request issueId={issueId} />
        </Match>
      </Switch>
      <IssueAction issueId={issueId} />
      <IssueComment issueId={issueId} />
    </div>
  );
};
