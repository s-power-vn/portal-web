import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/$organizationId/settings/general/'
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$organizationId/settings/general/departments',
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
