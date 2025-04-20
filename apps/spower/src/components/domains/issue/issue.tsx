import { Loader, PaperclipIcon } from 'lucide-react';
import { api } from 'portal-api';
import { IssueDeadlineStatusOptions, currentEmployeeId } from 'portal-core';

import type { FC } from 'react';
import { Suspense, lazy } from 'react';

import { Show, cn } from '@minhdtb/storeo-core';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@minhdtb/storeo-theme';

import { getObjectDisplayComponent } from '../../../modules.gen';
import { IssueAction } from './issue-action';
import { IssueAttachment } from './issue-attachment';
import { IssueComment } from './issue-comment';
import { IssueSummary } from './issue-summary';

export type IssueProps = {
  issueId: string;
};

type DynamicObjectDisplayProps = {
  objectType: string;
  issueId: string;
};

const DynamicObjectDisplay: FC<DynamicObjectDisplayProps> = ({
  objectType,
  issueId
}) => {
  const Component = lazy(getObjectDisplayComponent(objectType));
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      }
    >
      <Component issueId={issueId} />
    </Suspense>
  );
};

const IssueComponent: FC<IssueProps> = ({ issueId }) => {
  const { data: issue } = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const assignees = issue.assignees || [];

  const isUserAssigned = assignees.some(a => a.id === currentEmployeeId.value);

  const getContentComponent = () => {
    if (!issue.object?.objectType?.id) return <div className={`p-2`}></div>;

    const typeName = issue.object.objectType.name;
    if (!typeName) return <div className={`p-2`}></div>;

    return <DynamicObjectDisplay objectType={typeName} issueId={issueId} />;
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-md border',
        issue.deadlineStatus === IssueDeadlineStatusOptions.Normal
          ? 'border-t-appSuccess border-t-4'
          : issue.deadlineStatus === IssueDeadlineStatusOptions.Warning
            ? 'border-t-appWarning border-t-4'
            : 'border-t-appError border-t-4'
      )}
    >
      <IssueSummary issueId={issueId} />
      <Tabs defaultValue={'detail'}>
        <TabsList className="grid w-full grid-cols-4 gap-1 rounded-none">
          <TabsTrigger value="detail" asChild>
            <div className={'cursor-pointer select-none'}>Nội dung</div>
          </TabsTrigger>
          {issue.files?.length && issue.files.length > 0 && (
            <TabsTrigger value="attachment" asChild>
              <div className={'flex cursor-pointer select-none gap-1'}>
                <PaperclipIcon className={'h-5 w-4'}></PaperclipIcon>
                File đính kèm
              </div>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="detail" className={'mt-0'}>
          {getContentComponent()}
        </TabsContent>
        <TabsContent value="attachment">
          {issue.files?.length && issue.files.length > 0 && (
            <IssueAttachment issueId={issueId} />
          )}
        </TabsContent>
      </Tabs>
      <Show when={isUserAssigned}>
        <IssueAction issueId={issueId} />
      </Show>
      <IssueComment issueId={issueId} />
    </div>
  );
};

export const Issue: FC<IssueProps> = props => {
  return (
    <Suspense fallback={<Loader className={'h-6 w-6 animate-spin'} />}>
      <IssueComponent {...props} />
    </Suspense>
  );
};
