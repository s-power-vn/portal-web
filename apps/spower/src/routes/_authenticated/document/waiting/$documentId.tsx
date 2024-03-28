import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import PocketBase from 'pocketbase';

import { DocumentResponse, usePb } from '@storeo/core';

function getDocument(id: string, pb?: PocketBase) {
  return pb?.collection<DocumentResponse>('document').getOne(id, {
    expand: 'customer'
  });
}

export function documentOptions(id: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['document', id],
    queryFn: () => getDocument(id, pb)
  });
}

const Component = () => {
  const { documentId } = Route.useParams();
  const pb = usePb();
  const documentQuery = useSuspenseQuery(documentOptions(documentId, pb));

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-col'}>
        <span className={'text-appBlack text-lg font-semibold'}>
          {documentQuery.data?.bidding}
        </span>
        <span className={'text-muted-foreground text-sm'}>
          {documentQuery.data?.name} -{' '}
          {
            (documentQuery.data?.expand as { customer: { name: string } })
              ?.customer.name
          }
        </span>
      </div>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId'
)({
  component: Component,
  loader: ({ context: { pb, queryClient }, params: { documentId } }) =>
    queryClient?.ensureQueryData(documentOptions(documentId, pb)),
  beforeLoad: ({ params }) => ({ title: params.documentId })
});
