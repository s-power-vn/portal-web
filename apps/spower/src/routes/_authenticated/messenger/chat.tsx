import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/messenger/chat')({
  component: () => <Outlet />
});
