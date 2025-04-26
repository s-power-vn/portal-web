import { createFileRoute, redirect } from '@tanstack/react-router';

import { enhancedWaitAuthenticated } from './auth/auth-cache';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const authResult = await enhancedWaitAuthenticated();
    if (authResult?.status === 'authorized' && authResult.organizationId) {
      throw redirect({
        to: `/$organizationId/home`,
        params: {
          organizationId: authResult.organizationId
        }
      });
    }

    throw redirect({
      to: '/top'
    });
  }
});
