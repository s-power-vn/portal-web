import { Cross2Icon } from '@radix-ui/react-icons';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';

import { FC, Suspense, useState } from 'react';

import {
  CommentResponse,
  DialogProps,
  IssueResponse,
  RequestStatusOptions,
  UserResponse,
  client,
  useOutsideClick
} from '@storeo/core';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea
} from '@storeo/theme';

import { ProjectSearch, RequestData } from '../../../api';
import { RequestItem } from './request-item';
import { RequestStatus } from './request-status';

const Content: FC<RequestDetailDialogProps> = ({
  issueId,
  open,
  setOpen,
  search
}) => {
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
        }),
    enabled: open
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
      setOpen(false);
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
      setOpen(false);
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

  return (
    <DialogContent className="flex min-w-[80%] flex-col">
      <DialogHeader>
        <DialogTitle className={'flex items-center justify-between gap-4 pr-4'}>
          <div className={'flex items-center gap-2'}>
            <span className={'w-full'}>{request.data.expand.issue.title}</span>
            <Button className={'p-0 text-gray-500'} variant={'link'}>
              <PencilIcon width={15} height={15} />
            </Button>
          </div>
          <RequestStatus
            className={'px-3 py-2 text-sm italic'}
            issueId={issueId}
          />
        </DialogTitle>
      </DialogHeader>
      <RequestItem requestId={request.data.id} />
      <div className={'flex basis-1/3 flex-col gap-2'} ref={ref}>
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
      </div>
      <div
        className={
          'flex max-h-[150px] basis-1/2 flex-col gap-2 overflow-y-auto p-1'
        }
      >
        {comments.data && comments.data.length > 0
          ? comments.data.map(it => (
              <div
                className={'relative flex rounded-md border p-2'}
                key={it.id}
              >
                <div className={'flex flex-col pr-3'}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`http://localhost:8090/api/files/user/${it.expand.createdBy.id}/${it.expand.createdBy.avatar}`}
                    />
                    <AvatarFallback className={'text-sm'}>
                      {it.expand.createdBy.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className={'flex flex-col gap-1'}>
                  <div className={'text-sm font-bold text-gray-500'}>
                    {it.expand.createdBy.name}
                  </div>
                  <div className={'text-sm italic'}>{it.content}</div>
                </div>
                {client.authStore.model?.id === it.expand.createdBy.id ? (
                  <Button
                    className={
                      'text-appWhite absolute right-2 top-2 h-4 w-4 rounded-full bg-red-400 p-1'
                    }
                    variant={'ghost'}
                    onClick={() => deleteComment.mutate(it.id)}
                  >
                    <Cross2Icon width={20} height={20}></Cross2Icon>
                  </Button>
                ) : null}
              </div>
            ))
          : null}
      </div>
      <DialogFooter>
        {client.authStore.model?.role === 1 &&
        client.authStore.model?.id === request.data.expand.issue.assignee ? (
          <>
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
          </>
        ) : null}
      </DialogFooter>
    </DialogContent>
  );
};

export type RequestDetailDialogProps = DialogProps & {
  issueId: string;
  search?: ProjectSearch;
};

export const RequestDetailDialog: FC<RequestDetailDialogProps> = props => {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <Suspense>
        <Content {...props} />
      </Suspense>
    </Dialog>
  );
};
