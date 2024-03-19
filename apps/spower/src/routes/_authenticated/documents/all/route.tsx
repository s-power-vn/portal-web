import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/documents/all')({
  component: () => {
    return <div>Hello Ticket Type 1!</div>;
  }
});
