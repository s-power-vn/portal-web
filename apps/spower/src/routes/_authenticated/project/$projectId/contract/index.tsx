import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/contract/'
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/project/$projectId/contract/input',
      params
    });
  }
});
