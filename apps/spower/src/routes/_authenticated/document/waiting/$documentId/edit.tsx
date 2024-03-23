import { createFileRoute } from '@tanstack/react-router';

import { DocumentEdit, documentOptions } from '../../../../../components';


const Component = () => {
  const { documentId } = Route.useParams();
  return <DocumentEdit documentId={documentId} />;
};

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId/edit'
)({
  component: Component,
  loader: ({ context: { pb, queryClient }, params: { documentId } }) =>
    queryClient?.ensureQueryData(documentOptions(documentId, pb)),
  beforeLoad: () => ({
    title: 'Edit'
  })
});
