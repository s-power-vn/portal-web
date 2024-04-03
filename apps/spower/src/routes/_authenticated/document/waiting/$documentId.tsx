import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import { DocumentResponse, client } from '@storeo/core';

export function getDocumentOptions(documentId: string) {
  return queryOptions({
    queryKey: ['getDocument', documentId],
    queryFn: () =>
      client.collection<DocumentResponse>('document').getOne(documentId, {
        expand: 'customer'
      })
  });
}

const Component = () => {
  const { documentId } = Route.useParams();
  const documentQuery = useSuspenseQuery(getDocumentOptions(documentId));

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
  loader: ({ context: { queryClient }, params: { documentId } }) =>
    queryClient?.ensureQueryData(getDocumentOptions(documentId)),
  beforeLoad: ({ params }) => ({ title: params.documentId })
});
