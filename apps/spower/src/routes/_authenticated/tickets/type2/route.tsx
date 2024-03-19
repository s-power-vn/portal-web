import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/tickets/type2')({
  component: () => {
    return <div>Hello Ticket Type 2!</div>;
  }
});
