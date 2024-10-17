import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import {
  CalendarIcon,
  Edit3,
  Loader,
  MoreHorizontalIcon,
  Undo2Icon
} from 'lucide-react';

import { FC, useCallback, useRef } from 'react';

import {
  Collections,
  IssueDeadlineStatusOptions,
  IssueTypeOptions,
  Match,
  Show,
  Switch,
  client,
  cn,
  formatDateTime,
  getImageUrl,
  timeSince
} from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeButton,
  closeModal,
  showModal,
  useConfirm
} from '@storeo/theme';

import { commentApi, requestApi } from '../../../api';
import { issueApi } from '../../../api/issue';
import { EditRequestForm } from '../request/edit-request-form';
import { Request } from '../request/request';
import { RequestStatusText } from '../request/status/request-status-text';

export type IssueProps = {
  issueId: string;
};

export const Issue: FC<IssueProps> = ({ issueId }) => {
  const router = useRouter();

  const issue = issueApi.byId.useSuspenseQuery({
    variables: issueId
  });

  const request = requestApi.byIssueId.useSuspenseQuery({
    variables: issueId
  });

  const { confirm } = useConfirm();

  const comments = commentApi.list.useSuspenseQuery({
    variables: issueId
  });

  const queryClient = useQueryClient();

  const deleteComment = commentApi.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: commentApi.list.getKey(issueId)
        })
      ]);
    }
  });

  const modalId = useRef<string | undefined>();

  const onSuccessHandler = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: issueApi.byId.getKey(issueId)
      }),
      queryClient.invalidateQueries({
        queryKey: requestApi.byIssueId.getKey(issueId)
      })
    ]);
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, [issueId, queryClient]);

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleEditIssue = useCallback(() => {
    modalId.current = showModal({
      title: 'Sửa công việc',
      className: 'min-w-[40rem]',
      children: (
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
              onSuccess={onSuccessHandler}
              onCancel={onCancelHandler}
            />
          </Match>
        </Switch>
      )
    });
  }, [issue.data.type, issueId, onCancelHandler, onSuccessHandler]);

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
                <span className={'truncate'}>{request.data.code}</span>
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
      </div>
      <div className={'p-2'}>
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
      <div className={'flex flex-col gap-2'}>
        <div className={'flex flex-col gap-2'}>
          {comments.data && comments.data.length > 0
            ? comments.data.map(it => (
                <div className={'relative flex border-b p-2'} key={it.id}>
                  <div className={'flex flex-col pr-3'}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getImageUrl(
                          Collections.User,
                          it.expand.createdBy.id,
                          it.expand.createdBy.avatar
                        )}
                      />
                      <AvatarFallback className={'text-sm'}>
                        {it.expand.createdBy.name.split(' ')[0][0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={'flex flex-col gap-1'}>
                    <div className={'flex items-center gap-2'}>
                      <div className={'text-sm font-bold'}>
                        {it.expand.createdBy.name}
                      </div>
                      <div
                        className={
                          'flex items-center gap-1 text-xs text-gray-500'
                        }
                      >
                        <CalendarIcon className={'h-3 w-3'} />
                        {timeSince(new Date(Date.parse(it.created)))}
                      </div>
                      <Show when={issue.data.type === IssueTypeOptions.Request}>
                        <RequestStatusText status={it.status} />
                      </Show>
                    </div>
                    <div className={'text-sm'}>{it.content}</div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};
