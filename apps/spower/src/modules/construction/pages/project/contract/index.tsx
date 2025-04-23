import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_private/$organizationId/project/$projectId/contract/'
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$organizationId/project/$projectId/contract/input',
      params
    });
  }
});
