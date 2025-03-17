import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/settings/operation/')({
  beforeLoad: async ({ params }) => {
    throw redirect({
      to: '/settings/operation/objects'
    });
  }
});
