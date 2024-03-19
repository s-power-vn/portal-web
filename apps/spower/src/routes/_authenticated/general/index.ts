import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/')({
  loader: () => {
    throw redirect({
      to: '/general/employee'
    });
  }
});
