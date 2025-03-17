import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/settings/general/')({
  beforeLoad: () => {
    throw redirect({
      to: '/settings/general/departments'
    });
  }
});
