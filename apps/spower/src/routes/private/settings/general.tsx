import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/settings/general')({
  beforeLoad: () => {
    return {
      title: 'Cài đặt chung'
    };
  }
});
