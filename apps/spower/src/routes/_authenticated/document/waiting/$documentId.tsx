import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import { usePb } from '@storeo/core';

import { documentOptions } from '../../../../components';

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
