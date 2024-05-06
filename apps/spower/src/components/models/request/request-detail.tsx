import { Cross2Icon } from '@radix-ui/react-icons';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { CalendarIcon, Undo2Icon, User2Icon } from 'lucide-react';

import { FC, useState } from 'react';

import {
  Collections,
  CommentResponse,
  IssueResponse,
  RequestStatusOptions,
  Show,
  UserResponse,
  client,
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
  useConfirm
} from '@storeo/theme';

import { RequestData } from '../../../api';
import { IssueAssignee } from '../issue/issue-assignee';
import { IssueTitle } from '../issue/issue-title';
import { RequestItem } from './request-item';
import { RequestStatus } from './request-status';

export type RequestDetailProps = {
  issueId: string;
};

export const RequestDetail: FC<RequestDetailProps> = ({ issueId }) => {
  const [comment, setComment] = useState('');
  const [showCommentButton, setShowCommentButton] = useState(false);
  const ref = useOutsideClick(() => {
    setShowCommentButton(false);
  });

  const request = useSuspenseQuery({
    queryKey: ['getRequest', issueId],
    queryFn: () =>
      client
        .collection<RequestData>('request')
        .getFirstListItem(`issue = "${issueId}"`, {
          expand: 'issue,issue.createdBy'
        })
  });

  const comments = useQuery({
    queryKey: ['getComments', issueId],
    queryFn: () =>
      client
        .collection<
          CommentResponse & {
            expand: {
              issue: IssueResponse;
              createdBy: UserResponse;
            };
          }
        >('comment')
        .getFullList({
          filter: `issue = "${issueId}"`,
          expand: 'issue,createdBy',
          sort: '-created'
        })
  });

  const queryClient = useQueryClient();

  const approveRequest = useMutation({
    mutationKey: ['approveRequest', request.data.id],
    mutationFn: async () => {
      const status =
        request.data.status === RequestStatusOptions.ToDo
          ? RequestStatusOptions.VolumeDone
          : RequestStatusOptions.Done;
      return Promise.all([
        client.collection('request').update(request.data.id, {
          status
        }),
        client.collection('issue').update(issueId, {
          assignee: request.data.expand.issue.lastAssignee,
          lastAssignee: client.authStore.model?.id
        })
      ]);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getMyIssuesKey']
        }),
        queryClient.invalidateQueries({
          queryKey: ['getAllIssuesKey']
        })
      ]);
    }
  });

  const rejectRequest = useMutation({
    mutationKey: ['rejectRequest', request.data.id],
    mutationFn: async () => {
      const status = RequestStatusOptions.VolumeDone
        ? RequestStatusOptions.ToDo
        : RequestStatusOptions.VolumeDone;

      return Promise.all([
        client.collection('request').update(request.data.id, {
          status
        }),
        client.collection('issue').update(issueId, {
          assignee: request.data.expand.issue.lastAssignee,
          lastAssignee: client.authStore.model?.id
        })
      ]);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getMyIssuesKey']
        }),
        queryClient.invalidateQueries({
          queryKey: ['getAllIssuesKey']
        })
      ]);
    }
  });

  const createComment = useMutation({
    mutationKey: ['createComment', issueId],
    mutationFn: async (comment: string) => {
      return Promise.all([
        client.collection('comment').create({
          content: comment,
          issue: issueId,
          createdBy: client.authStore.model?.id
        })
      ]);
    },
    onSuccess: async () => {
      setShowCommentButton(false);
      setComment('');
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getComments', issueId]
        })
      ]);
    }
  });

  const deleteComment = useMutation({
    mutationKey: ['deleteComment'],
    mutationFn: async (id: string) => {
      return Promise.all([client.collection('comment').delete(id)]);
    },
    onSuccess: async () => {
      setShowCommentButton(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getComments', issueId]
        })
      ]);
    }
  });

  const { confirm } = useConfirm();
  const router = useRouter();

  return (
    <>
      <div
        className={
          'bg-appGrayLight flex items-start justify-between border-b p-2'
        }
      >
        <div className={'flex w-full flex-col gap-1'}>
          <div className={'flex items-center gap-2'}>
            <RequestStatus
              className={'px-3 py-1.5 text-xs font-bold'}
              issueId={issueId}
            />
            <Button
              className={'h-6'}
              size={'icon'}
              onClick={() => router.history.back()}
            >
              <Undo2Icon className={'h-4 w-4'} />
            </Button>
          </div>
          <IssueTitle
            issueId={issueId}
            title={request.data.expand.issue.title}
          />
          <div className={'flex items-center gap-2'}>
            <div className={'flex items-center gap-1 text-xs'}>
              <CalendarIcon className={'h-4 w-4'} />
              {formatDate(request.data.created)}
            </div>
            <div className={'flex items-center gap-1 text-xs'}>
              <User2Icon className={'h-4 w-4'} />
              {request.data.expand.issue.expand?.createdBy.name}
            </div>
          </div>
        </div>
        <div className={'flex items-center gap-2'}>
          {client.authStore.model?.role !== 1 ? (
            <>
              <span className={'whitespace-nowrap text-sm'}>
                Người thực hiện
              </span>
              <IssueAssignee
                projectId={request.data.project}
                issueId={request.data.expand.issue.id}
                value={request.data.expand.issue.assignee}
                className={'w-56'}
              ></IssueAssignee>
            </>
          ) : null}
        </div>
        <Show
          when={
            client.authStore.model?.role === 1 &&
            client.authStore.model?.id === request.data.expand.issue.assignee
          }
        >
          <div className={'flex gap-2'}>
            <Button
              className={'bg-blue-500 hover:bg-blue-600'}
              onClick={() => approveRequest.mutate()}
            >
              Phê duyệt
            </Button>
            <Button
              className={'bg-red-500 hover:bg-red-600'}
              onClick={() => rejectRequest.mutate()}
            >
              Từ chối
            </Button>
          </div>
        </Show>
      </div>
      <div
        className={
          'flex h-[calc(100vh-200px)] flex-col gap-2 overflow-y-auto p-2'
        }
      >
        <RequestItem requestId={request.data.id} />
        <div className={'flex flex-col gap-2'} ref={ref}>
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
                onClick={() => createComment.mutate(comment)}
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
    </>
  );
};
