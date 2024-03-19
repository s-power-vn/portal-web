import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/general/employee/$employeeId'
)({
  loader: async () => {
    throw notFound();
  },
  notFoundComponent: () => <>NOT</>
});
