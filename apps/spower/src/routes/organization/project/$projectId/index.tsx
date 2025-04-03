import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/$organizationId/project/$projectId/'
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$organizationId/project/$projectId/issues/me',
      params: {
        organizationId: params.organizationId,
        projectId: params.projectId
      },
      search: {
        pageIndex: 0,
        pageSize: 10,
        filter: ''
      }
    });
  }
});
