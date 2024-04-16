import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issue/me'
)({
  component: () => (
    <div>Hello /_authenticated/project/$projectId/issue/me!</div>
  ),
  beforeLoad: () => ({ title: 'Công việc của tôi' })
});
