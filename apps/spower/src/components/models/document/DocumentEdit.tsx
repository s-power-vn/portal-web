import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { FC } from 'react';

import { DocumentResponse, usePb } from '@storeo/core';

function getDocument(id: string, pb?: PocketBase) {
  return pb?.collection<DocumentResponse>('document').getOne(id);
}

export function documentOptions(id: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['document', id],
    queryFn: () => getDocument(id, pb)
  });
}

export type DocumentEditProps = {
  documentId: string;
};

export const DocumentEdit: FC<DocumentEditProps> = ({ documentId }) => {
  const pb = usePb();
  const documentQuery = useSuspenseQuery(documentOptions(documentId, pb));
  return (
    <div className={'flex flex-col'}>
      <span>{documentQuery.data?.bidding}</span>
    </div>
  );
};
