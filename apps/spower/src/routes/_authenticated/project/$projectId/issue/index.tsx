import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issue/'
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/project/$projectId/issue/me',
      params
    });
  }
});
