import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/general/employee')({
  component: () => {
    return <div>Hello Ticket Type 1!</div>;
  }
});
