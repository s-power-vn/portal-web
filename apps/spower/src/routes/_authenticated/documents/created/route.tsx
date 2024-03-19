import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/documents/created')({
  component: () => {
    return <div>Hello Ticket Type 2!</div>;
  }
});
