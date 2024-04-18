import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import { PencilIcon } from 'lucide-react';

import { FC, Suspense } from 'react';

import { DialogProps, RequestStatusOptions, client } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@storeo/theme';

import { RequestData } from '../../../api';
import { getAllIssuesKey, getMyIssuesKey } from '../../../api/issue';
import { RequestItem } from './request-item';

const Content: FC<RequestDetailDialogProps> = ({ issueId, setOpen }) => {
  const request = useSuspenseQuery({
    queryKey: ['getRequest', issueId],
    queryFn: () =>
      client
        .collection<RequestData>('request')
        .getFirstListItem(`issue = "${issueId}"`, {
          expand: 'issue'
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
      setOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getMyIssuesKey(request.data.project)
        }),
        queryClient.invalidateQueries({
          queryKey: getAllIssuesKey(request.data.project)
        })
      ]);
    }
  });

  return (
    <DialogContent className="flex min-w-[80%] flex-col">
      <DialogHeader>
        <DialogTitle className={'flex items-center justify-between'}>
          <div className={'flex items-center gap-4'}>
            {request.data.expand.issue.title}
            <Button className={'p-0 text-gray-500'} variant={'link'}>
              <PencilIcon width={15} height={15} />
            </Button>
          </div>
          {request.data.status === RequestStatusOptions.ToDo ? (
            client.authStore.model?.role === 1 &&
            client.authStore.model?.id ===
              request.data.expand.issue.assignee ? (
              <span
                className={
                  'm-4 whitespace-nowrap text-base italic text-red-500'
                }
              >
                Chờ duyệt khối lượng
              </span>
            ) : (
              <span
                className={
                  'm-4 whitespace-nowrap text-base italic text-red-500'
                }
              >
                Đang xử lý khối lượng
              </span>
            )
          ) : request.data.status === RequestStatusOptions.VolumeDone ? (
            client.authStore.model?.role === 1 &&
            client.authStore.model?.id ===
              request.data.expand.issue.assignee ? (
              <span
                className={
                  'm-4 whitespace-nowrap text-base italic text-orange-500'
                }
              >
                Chờ duyệt giá
              </span>
            ) : (
              <span
                className={
                  'm-4 whitespace-nowrap text-base italic text-orange-500'
                }
              >
                Đang xử lý giá
              </span>
            )
          ) : (
            <span
              className={'m-4 whitespace-nowrap text-base italic text-blue-500'}
            >
              Đã duyệt
            </span>
          )}
        </DialogTitle>
      </DialogHeader>
      <RequestItem requestId={request.data.id} />
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
            <Button className={'bg-red-500 hover:bg-red-600'}>Từ chối</Button>
          </>
        ) : null}
      </DialogFooter>
    </DialogContent>
  );
};

export type RequestDetailDialogProps = DialogProps & {
  issueId: string;
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