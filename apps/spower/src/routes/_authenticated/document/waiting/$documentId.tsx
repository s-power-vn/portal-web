import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import { getDocumentById } from '../../../../api';

const Component = () => {
  const { documentId } = Route.useParams();
  const document = useSuspenseQuery(getDocumentById(documentId));

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-col'}>
        <span className={'text-appBlack text-lg font-semibold'}>
          {document.data?.bidding}
        </span>
        <span className={'text-muted-foreground text-sm'}>
          {document.data?.name} - {document.data?.expand.customer.name}
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
    queryClient?.ensureQueryData(getDocumentById(documentId)),
  beforeLoad: ({ params }) => ({ title: params.documentId })
});
