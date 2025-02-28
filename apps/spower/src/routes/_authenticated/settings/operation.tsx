import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settings/operation')({
  beforeLoad: () => {
    return {
      title: 'Vận hành'
    };
  }
});
