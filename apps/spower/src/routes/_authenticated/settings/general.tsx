import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settings/general')({
  beforeLoad: () => {
    return {
      title: 'Chung'
    };
  }
});
