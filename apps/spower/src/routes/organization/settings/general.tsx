import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/_organization/settings/general')({
  beforeLoad: () => {
    return {
      title: 'Cài đặt chung'
    };
  }
});
