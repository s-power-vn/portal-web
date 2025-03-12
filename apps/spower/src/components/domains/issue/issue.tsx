import { ObjectData } from 'libs/api/src/api/setting/operation/object';
import { Loader } from 'lucide-react';
import { api } from 'portal-api';
import { IssueDeadlineStatusOptions, client } from 'portal-core';

import type { FC } from 'react';
import { Suspense } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';

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

  const getContentComponent = () => {
    if (!objectData?.expand?.type) return <div className={`p-2`}></div>;

    const typeName = objectData.expand.type.name;

    if (typeName === 'Request') {
      return <RequestDisplay issueId={issueId} />;
    } else if (typeName === 'Price') {
      return <PriceDisplay issueId={issueId} />;
    }

    return <div className={`p-2`}></div>;
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-md border',
        issue.data.deadlineStatus === IssueDeadlineStatusOptions.Normal
          ? 'border-t-appSuccess border-t-4'
          : issue.data.deadlineStatus === IssueDeadlineStatusOptions.Warning
            ? 'border-t-appWarning border-t-4'
            : 'border-t-appError border-t-4'
      )}
    >
      <IssueSummary issueId={issueId} />
      {getContentComponent()}
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
