import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/documents/waiting')({
  component: () => {
    return <div>Hello Ticket Type 2!</div>;
  }
});
