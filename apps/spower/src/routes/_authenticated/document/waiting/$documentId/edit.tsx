import { createFileRoute } from '@tanstack/react-router';

import { DocumentEdit } from '../../../../../components';

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId/edit'
)({
  component: DocumentEdit
});
