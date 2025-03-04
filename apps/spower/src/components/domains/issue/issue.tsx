import { ObjectData } from 'libs/api/src/api/setting/operation/object';
import { Loader } from 'lucide-react';
import { api } from 'portal-api';
import {
  IssueDeadlineStatusOptions,
  ObjectTypeOptions,
  client
} from 'portal-core';

import type { FC } from 'react';
import { Suspense } from 'react';

import { Match, Show, Switch, cn } from '@minhdtb/storeo-core';

import { PriceDisplay } from '../price';
import { RequestDisplay } from '../request';
import { IssueAction } from './issue-action';
import { IssueComment } from './issue-comment';
import { IssueSummary } from './issue-summary';

export type IssueProps = {
  issueId: string;
};

interface ExpandType {
  object?: ObjectData;
  [key: string]: unknown;
}

const IssueComponent: FC<IssueProps> = ({ issueId }) => {
  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const expand = (issue.data.expand || {}) as ExpandType;
  const objectData = expand.object;
  const assignees = issue.data.assignees || [];

  const isUserAssigned = assignees.includes(client.authStore.record?.id || '');

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
        <Match when={objectData?.type === ObjectTypeOptions.Request}>
          <RequestDisplay issueId={issueId} />
        </Match>
        <Match when={objectData?.type === ObjectTypeOptions.Price}>
          <PriceDisplay issueId={issueId} />
        </Match>
      </Switch>
      <Show when={isUserAssigned}>
        <IssueAction issueId={issueId} />
      </Show>
      <IssueComment issueId={issueId} />
    </div>
  );
};

export const Issue: FC<IssueProps> = props => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <Loader className={'h-6 w-6 animate-spin'} />
        </div>
      }
    >
      <IssueComponent {...props} />
    </Suspense>
  );
};
