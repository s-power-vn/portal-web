import { useSuspenseQuery } from '@tanstack/react-query';

import { FC, Suspense } from 'react';

import { DialogProps, client } from '@storeo/core';
import {
  Dialog,
  DialogContent,
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
