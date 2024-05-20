import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settings')({
  component: () => <div></div>,
  beforeLoad: () => ({ title: 'Cài đặt' })
});
