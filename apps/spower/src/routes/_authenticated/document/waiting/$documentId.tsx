import { createFileRoute } from '@tanstack/react-router';

import { getDocumentOptions } from '../../../../components';

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId'
)({
  loader: ({ context: { queryClient }, params: { documentId } }) =>
    queryClient?.ensureQueryData(getDocumentOptions(documentId)),
  beforeLoad: ({ params }) => ({ title: params.documentId })
});
