import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/_organization/project/$projectId/')({
  beforeLoad: () => {
    throw redirect({
      from: Route.fullPath,
      to: './issues/me'
    });
  }
});
