import { useSuspenseQuery } from '@tanstack/react-query';

import { FC, Suspense } from 'react';

import { DialogProps, client } from '@storeo/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@storeo/theme';

import { RequestData } from '../../../api';
import { RequestItem } from './request-item';

const Content: FC<RequestDetailDialogProps> = ({ issueId }) => {
  const request = useSuspenseQuery({
    queryKey: ['getRequest', issueId],
    queryFn: () =>
      client
        .collection<RequestData>('request')
        .getFirstListItem(`issue = "${issueId}"`, {
          expand: 'issue'
        })
  });

  return (
    <DialogContent className="flex min-w-[800px] flex-col">
      <DialogHeader>
        <DialogTitle>{request.data.expand.issue.title}</DialogTitle>
      </DialogHeader>
      <RequestItem requestId={request.data.id} />
      <DialogFooter>
        {client.authStore.model?.role === 1 ? (
          <>
            <Button className={'bg-blue-500 hover:bg-blue-600'}>
              Phê duyệt
            </Button>
            <Button className={'bg-red-500 hover:bg-red-600'}>Từ chối</Button>
          </>
        ) : null}
        <Button>Đóng</Button>
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
