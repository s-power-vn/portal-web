import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId/'
)({
  beforeLoad: () => {
    throw redirect({
      from: Route.fullPath,
      to: './overview'
    });
  }
});
