import { PlusIcon } from '@radix-ui/react-icons';
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { FC } from 'react';

import { DocumentRequestResponse, usePb } from '@storeo/core';
import { Button } from '@storeo/theme';


function getDocumentRequests(documentId: string, pb?: PocketBase) {
  return pb
    ?.collection<DocumentRequestResponse>('documentRequest')
    .getFullList({
      filter: `document = "${documentId}"`
    });
}

export function documentRequestsOptions(documentId: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['documentRequests', documentId],
    queryFn: () => getDocumentRequests(documentId, pb)
  });
}

export type DocumentRequestProps = {
  documentId: string;
};

export const DocumentRequest: FC<DocumentRequestProps> = ({ documentId }) => {
  const pb = usePb();
  const documentRequestsQuery = useSuspenseQuery(
    documentRequestsOptions(documentId, pb)
  );

  const queryClient = useQueryClient();

  console.log(documentRequestsQuery.data);

  return (
    <>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex gap-2'}>
          <Button className={'flex gap-1'} onClick={() => {}}>
            <PlusIcon />
            Thêm yêu cầu mua hàng
          </Button>
          <Button disabled={true} className={'flex gap-1'} onClick={() => {}}>
            <PlusIcon />
            Thêm nhà cung cấp
          </Button>
        </div>
      </div>
    </>
  );
};
