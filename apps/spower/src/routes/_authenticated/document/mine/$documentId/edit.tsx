import { createFileRoute } from '@tanstack/react-router';

import { DocumentEdit } from '../../../../../components';

const Component = () => {
  const { documentId } = Route.useParams();
  return <DocumentEdit documentId={documentId} />;
};

export const Route = createFileRoute(
  '/_authenticated/document/mine/$documentId/edit'
)({
  component: Component
});
