import { useRouter } from '@tanstack/react-router';
import { Edit3, Loader, MoreHorizontalIcon, Undo2Icon } from 'lucide-react';
import { api } from 'portal-api';
import { IssueDeadlineStatusOptions, IssueTypeOptions } from 'portal-core';

import React, { FC, useCallback } from 'react';

import { Match, Show, Switch, cn, formatDateTime } from '@minhdtb/storeo-core';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  showModal
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import { EditRequestForm } from '../request/edit-request-form';
import { Request } from '../request/request';
import { DeadlineStatus } from '../request/status/deadline-status';
import { IssueStatus } from './issue-status';

export type IssueProps = {
  issueId: string;
};

export const Issue: FC<IssueProps> = ({ issueId }) => {
  const router = useRouter();
  const invalidates = useInvalidateQueries();

  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const request = api.request.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const handleEditIssue = useCallback(() => {
    showModal({
      title: 'Sửa công việc',
      className: 'min-w-[40rem]',
      children: ({ close }) => (
        <Switch
          fallback={
            <div className={`p-2`}>
              <Loader className={'h-6 w-6 animate-spin'} />
            </div>
          }
        >
          <Match when={issue.data.type === IssueTypeOptions.Request}>
            <EditRequestForm
              issueId={issueId}
              onSuccess={() => {
                invalidates([
                  api.issue.byId.getKey(issueId),
                  api.request.byIssueId.getKey(issueId)
                ]);
                close();
              }}
              onCancel={close}
            />
          </Match>
        </Switch>
      )
    });
  }, [invalidates, issue.data.type, issueId]);

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
      <div className={'flex flex-col gap-2 border-b p-2'}>
        <div className={'flex items-center gap-2'}>
          <Button
            className={'h-6 w-10'}
            size={'icon'}
            onClick={() => router.history.back()}
          >
            <Undo2Icon className={'h-4 w-4'} />
          </Button>
          <span className={'flex-1 text-base font-bold  '}>
            {issue.data.title}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ThemeButton
                variant={'outline'}
                className={'h-6 w-6'}
                size={'icon'}
                onClick={() => router.history.back()}
              >
                <MoreHorizontalIcon className={'h-4 w-4'} />
              </ThemeButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={handleEditIssue}>
                <Edit3 className="mr-2 h-4 w-4 text-red-500" />
                Sửa công việc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={'mr-2 flex w-full gap-6'}>
          <div className={'flex flex-1 flex-col items-center gap-2 text-sm'}>
            <div className={'flex w-full items-center justify-between gap-2'}>
              <span className={'text-appBlue whitespace-nowrap text-xs'}>
                Ngày tạo
              </span>
              <span className={'truncate'}>
                {formatDateTime(issue.data.created)}
              </span>
            </div>
            <div className={'flex w-full items-center justify-between gap-2'}>
              <span className={'text-appBlue whitespace-nowrap text-xs'}>
                Ngày tạo
              </span>
              <span className={'truncate'}>
                {formatDateTime(issue.data.created)}
              </span>
            </div>
            <Show when={issue.data.type === IssueTypeOptions.Request}>
              <div className={'flex w-full items-center justify-between gap-2'}>
                <span className={'text-appBlue whitespace-nowrap text-xs'}>
                  Số phiếu
                </span>
                <span className={'truncate'}>{request.data?.code}</span>
              </div>
            </Show>
          </div>
          <div className={'flex flex-1 flex-col items-center gap-2 text-sm'}>
            <div className={'flex w-full items-center justify-between gap-2'}>
              <span className={'text-appBlue whitespace-nowrap text-xs'}>
                Người tạo
              </span>
              <span className={'truncate'}>
                {issue.data.expand?.createdBy.name}
              </span>
            </div>
            <div className={'flex w-full items-center justify-between gap-2'}>
              <span className={'text-appBlue whitespace-nowrap text-xs'}>
                Người xử lý
              </span>
              <span className={'truncate'}>
                {issue.data.expand?.assignee.name}
              </span>
            </div>
          </div>
          <div className={'flex flex-1 flex-col items-center gap-2 text-sm'}>
            <div className={'flex w-full items-center justify-between gap-2'}>
              <span className={'text-appBlue whitespace-nowrap text-xs'}>
                Ngày bắt đầu
              </span>
              <span className={'truncate'}>
                {formatDateTime(issue.data.startDate)}
              </span>
            </div>
            <div className={'flex w-full items-center justify-between gap-2'}>
              <span className={'text-appBlue whitespace-nowrap text-xs'}>
                Ngày kết thúc
              </span>
              <span className={'truncate'}>
                {formatDateTime(issue.data.endDate)}
              </span>
            </div>
          </div>
        </div>
        <div className={'flex gap-2'}>
          <DeadlineStatus
            className={'font-bold'}
            status={request.data?.expand.issue.deadlineStatus}
          />
          <IssueStatus
            className={'px-3 py-1.5 text-xs font-bold'}
            issueId={issueId}
          />
        </div>
      </div>
      <Switch
        fallback={
          <div className={`p-2`}>
            <Loader className={'h-6 w-6 animate-spin'} />
          </div>
        }
      >
        <Match when={issue.data.type === IssueTypeOptions.Request}>
          <Request issueId={issueId} />
        </Match>
      </Switch>
    </div>
  );
};
