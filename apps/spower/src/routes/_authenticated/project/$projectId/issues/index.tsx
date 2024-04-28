import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issues/'
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/project/$projectId/issues/me',
      params,
      search: {
        pageIndex: 1,
        pageSize: 10,
        filter: ''
      }
    });
  }
});
