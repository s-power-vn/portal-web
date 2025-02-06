import { useRouter } from '@tanstack/react-router';
import {
  Edit3,
  Loader,
  MoreHorizontalIcon,
  Trash2,
  Undo2Icon
} from 'lucide-react';
import { api } from 'portal-api';
import { IssueTypeOptions, client } from 'portal-core';

import type { FC } from 'react';
import { useCallback } from 'react';

import { Match, Show, Switch, formatDateTime } from '@minhdtb/storeo-core';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  showModal,
  useConfirm
} from '@minhdtb/storeo-theme';

import { useInvalidateQueries } from '../../../hooks';
import { EditRequestForm } from '../request/form/edit-request-form';
import { IssueDeadlineStatus } from './issue-deadline-status';
import { IssueStatus } from './issue-status';

export type IssueSummaryProps = {
  issueId: string;
};

export const IssueSummary: FC<IssueSummaryProps> = props => {
  const { issueId } = props;

  const invalidates = useInvalidateQueries();

  const router = useRouter();

  const { confirm } = useConfirm();

  const issue = api.issue.byId.useSuspenseQuery({
    variables: issueId
  });

  const deleteIssue = api.issue.delete.useMutation({
    onSuccess: () => {
      invalidates([
        api.issue.listRequest.getKey(),
        api.issue.listMine.getKey()
      ]);

      router.history.back();
    }
  });

  const handleEditIssue = useCallback(() => {
    showModal({
      title: 'Sửa công việc',
      className: 'flex min-w-[1000px] flex-col',
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

  const handleDeleteIssue = useCallback(() => {
    confirm('Bạn chắc chắn muốn xóa công việc này?', () =>
      deleteIssue.mutate(issueId)
    );
  }, [confirm, deleteIssue, issueId]);

  return (
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
        <Show when={client.authStore.model?.id === issue.data.assignee}>
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
                Sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteIssue}>
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Show>
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
              <span className={'truncate'}>{issue.data?.code}</span>
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
      <div className={'flex w-full justify-end gap-2'}>
        <IssueDeadlineStatus className={'font-bold'} issueId={issueId} />
        <IssueStatus
          className={'px-3 py-1.5 text-xs font-bold'}
          issueId={issueId}
        />
      </div>
    </div>
  );
};
