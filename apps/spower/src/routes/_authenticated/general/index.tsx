import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/')({
  beforeLoad: () => {
    throw redirect({
      to: '/general/employee'
    });
  }
});
