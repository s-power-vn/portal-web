import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/$organizationId/settings/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$organizationId/settings/general',
      params: {
        organizationId: params.organizationId
      }
    });
  }
});
