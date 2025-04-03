import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/$organizationId/settings/operation')({
  beforeLoad: () => {
    return {
      title: 'Cài đặt vận hành'
    };
  }
});
