import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/_organization/settings/')({
  beforeLoad: () => {
    throw redirect({
      to: '/settings/general'
    });
  }
});
