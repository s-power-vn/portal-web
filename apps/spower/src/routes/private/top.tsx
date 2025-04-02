import { createFileRoute } from '@tanstack/react-router';
import { api } from 'portal-api';

import { useCallback } from 'react';

import { Button } from '@minhdtb/storeo-theme';

export const Route = createFileRoute('/_private/top')({
  component: RouteComponent
});

function RouteComponent() {
  const listOrganization = api.organization.list.useSuspenseQuery();
  const createOrganization = api.organization.create.useMutation();

  console.log(listOrganization);

  const handleCreateOrganization = useCallback(() => {
    createOrganization.mutate({
      name: 'Organization 1'
    });
  }, [createOrganization]);
  return (
    <div>
      <Button onClick={handleCreateOrganization}>Create Organization</Button>
    </div>
  );
}
