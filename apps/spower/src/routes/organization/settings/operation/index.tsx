import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/operation/'
)({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: '/$organizationId/settings/operation/objects',
      params: {
        organizationId: params.organizationId
      },
      search: {
        pageIndex: 0,
        pageSize: 10,
        filter: ''
      }
    });
  }
});
