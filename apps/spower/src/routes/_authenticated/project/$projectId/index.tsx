import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/'
)({
  beforeLoad: () => {
    throw redirect({
      from: Route.fullPath,
      to: './overview'
    });
  }
});
