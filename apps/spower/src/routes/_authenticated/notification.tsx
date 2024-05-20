import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/notification')({
  component: () => <div></div>,
  beforeLoad: () => ({ title: 'Hoạt động' })
});
