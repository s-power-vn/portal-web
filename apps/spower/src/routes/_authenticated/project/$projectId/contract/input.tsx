import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/contract/input'
)({
  component: () => (
    <div>Hello /_authenticated/project/$projectId/contract/input!</div>
  ),
  beforeLoad: () => ({ title: 'Hợp đồng đầu vào' })
});
