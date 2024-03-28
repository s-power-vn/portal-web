import { createFileRoute } from '@tanstack/react-router';

const Component = () => {
  return <></>;
};

export const Route = createFileRoute(
  '/_authenticated/document/all/$documentId/edit'
)({
  component: Component,
  beforeLoad: () => ({
    title: 'Cập nhật'
  })
});
