import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/tickets/type1')({
  component: () => {
    return <div>Hello Ticket Type 1!</div>;
  }
});
