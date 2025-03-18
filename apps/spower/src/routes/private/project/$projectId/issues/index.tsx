import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/project/$projectId/issues/')({
  beforeLoad: ({ params, search }) => {
    throw redirect({
      to: '/project/$projectId/issues/me',
      params,
      search: {
        filter: 'test',
        pageIndex: 1,
        pageSize: 20
      }
    });
  }
});
