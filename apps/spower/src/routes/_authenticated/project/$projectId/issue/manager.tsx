import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/issue/manager'
)({
  component: () => (
    <div>Hello /_authenticated/project/$projectId/issue/manager!</div>
  ),
  beforeLoad: () => ({ title: 'Danh sách công việc' })
});
