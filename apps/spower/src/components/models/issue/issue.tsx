import { Cross2Icon } from '@radix-ui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { CalendarIcon, Loader, Undo2Icon } from 'lucide-react';

import { FC, useCallback, useRef, useState } from 'react';

import {
  Collections,
  IssueDeadlineStatusOptions,
  IssueTypeOptions,
  Match,
  Switch,
  client,
  cn,
  formatDate,
  getImageUrl,
  timeSince,
  useOutsideClick
} from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
  closeModal,
  showModal,
  useConfirm
} from '@storeo/theme';

import { commentApi } from '../../../api';
import { issueApi } from '../../../api/issue';
import { Request } from '../request/request';
import { EditIssueForm } from './edit-issue-form';

export type IssueProps = {
  issueId: string;
};

export const Issue: FC<IssueProps> = ({ issueId }) => {
  const [comment, setComment] = useState('');
  const [showCommentButton, setShowCommentButton] = useState(false);
  const ref = useOutsideClick(() => {
    setShowCommentButton(false);
  });

  const router = useRouter();

  const issue = issueApi.byId.useSuspenseQuery({
    variables: issueId
  });

  const { confirm } = useConfirm();

  const comments = commentApi.list.useSuspenseQuery({
    variables: issueId
  });

  const queryClient = useQueryClient();

  const createComment = commentApi.create.useMutation({
    onSuccess: async () => {
      setShowCommentButton(false);
      setComment('');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: commentApi.list.getKey(issueId)
        })
      ]);
    }
  });

  const deleteComment = commentApi.delete.useMutation({
    onSuccess: async () => {
      setShowCommentButton(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: commentApi.list.getKey(issueId)
        })
      ]);
    }
  });

  const modalId = useRef<string | undefined>();

  const onSuccessHandler = useCallback(async () => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleEditIssue = useCallback(() => {
    modalId.current = showModal({
      title: 'Sửa',
      children: <EditIssueForm issueId={issueId} onSuccess={onSuccessHandler} />
    });
  }, [issueId, onSuccessHandler]);

  return (
    <div
      className={cn(
        ``,
        issue.data.deadlineStatus === IssueDeadlineStatusOptions.Normal
          ? ''
          : issue.data.deadlineStatus === IssueDeadlineStatusOptions.Warning
            ? 'border-t-appWarning border-t-4'
            : 'border-t-appError border-t-4'
      )}
    >
      <div className={'flex flex-col gap-2 p-2'}>
        <div className={'flex items-center gap-2'}>
          <Button
            className={'h-6'}
            size={'icon'}
            onClick={() => router.history.back()}
          >
            <Undo2Icon className={'h-4 w-4'} />
          </Button>
          <span className={'text-base font-bold'}>{issue.data.title}</span>
        </div>
        <div className={'flex w-[550px] flex-col gap-2'}>
          <div className={'flex w-full items-center gap-6 text-sm'}>
            <div className={'flex flex-1 items-center justify-between'}>
              <span className={'text-appBlue text-xs'}>Ngày tạo</span>
              {formatDate(issue.data.created)}
            </div>
            <div className={'flex flex-1 items-center justify-between'}>
              <span className={'text-appBlue text-xs'}>Người tạo</span>
              {issue.data.expand?.createdBy.name}
            </div>
          </div>
          <div className={'flex w-full items-center gap-6 text-sm'}>
            <div className={'flex flex-1 items-center justify-between'}>
              <span className={'text-appBlue text-xs'}>Ngày bắt đầu</span>
              {formatDate(issue.data.startDate)}
            </div>
            <div className={'flex flex-1 items-center justify-between'}>
              <span className={'text-appBlue text-xs'}>Ngày kết thúc</span>
              {formatDate(issue.data.endDate)}
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
      <div className={'flex flex-col gap-2 px-2'} ref={ref}>
        <Textarea
          placeholder={'Ghi chú'}
          value={comment}
          onChange={e => {
            setComment(e.target.value);
          }}
          onFocus={() => setShowCommentButton(true)}
        />
        {showCommentButton ? (
          <div className={'flex items-center justify-end'}>
            <Button
              className={'h-4 p-4 text-xs'}
              onClick={() =>
                createComment.mutate({
                  comment,
                  issueId
                })
              }
            >
              Nhập
            </Button>
          </div>
        ) : null}
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
                      <div className={'text-sm font-bold text-gray-500'}>
                        {it.expand.createdBy.name}
                      </div>
                      <div className={'flex items-center gap-1 text-xs'}>
                        <CalendarIcon className={'h-3 w-3'} />
                        {timeSince(new Date(Date.parse(it.created)))}
                      </div>
                    </div>
                    <div className={'text-sm italic'}>{it.content}</div>
                  </div>
                  {client.authStore.model?.id === it.expand.createdBy.id ? (
                    <Button
                      className={
                        'text-appWhite bg-appError hover:bg-appErrorLight hover:text-appWhite absolute right-2 top-2 h-4 w-4 rounded-full p-1 shadow-lg'
                      }
                      variant={'ghost'}
                      onClick={() =>
                        confirm('Bạn chắc chắn muốn xóa ghi chú này?', () =>
                          deleteComment.mutate(it.id)
                        )
                      }
                    >
                      <Cross2Icon width={20} height={20}></Cross2Icon>
                    </Button>
                  ) : null}
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};
