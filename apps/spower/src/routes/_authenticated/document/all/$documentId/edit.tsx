import { createFileRoute } from '@tanstack/react-router';

import { documentOptions } from '../../../../../components';


const Component = () => {
  return <></>;
};

export const Route = createFileRoute(
  '/_authenticated/document/all/$documentId/edit'
)({
  component: Component,
  loader: ({ context: { pb, queryClient }, params: { documentId } }) =>
    queryClient?.ensureQueryData(documentOptions(documentId, pb)),
  beforeLoad: () => ({
    title: 'Cập nhật'
  })
});
