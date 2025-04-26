import { createFileRoute, redirect } from '@tanstack/react-router';
import { client2 } from 'portal-core';

export const Route = createFileRoute(
  '/_private/$organizationId/project/$projectId/'
)({
  beforeLoad: async ({ params }) => {
    await client2.api.refreshRestToken(params.organizationId, params.projectId);

    throw redirect({
      to: '/$organizationId/project/$projectId/issues/me',
      params: {
        organizationId: params.organizationId,
        projectId: params.projectId
      },
      search: {
        pageIndex: 0,
        pageSize: 10,
        filter: ''
      }
    });
  }
});
