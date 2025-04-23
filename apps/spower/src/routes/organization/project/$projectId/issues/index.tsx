import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/$organizationId/project/$projectId/issues/'
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$organizationId/project/$projectId/issues/me',
      params,
      search: {
        filter: '',
        pageIndex: 1,
        pageSize: 20
      }
    });
  }
});
