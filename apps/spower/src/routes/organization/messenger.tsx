import { createFileRoute } from '@tanstack/react-router';

import { DirectChat, PageHeader } from '../../components';

const Component = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-none">
        <PageHeader title="Tin nhắn" />
      </div>
      <DirectChat />
    </div>
  );
};

export const Route = createFileRoute('/_private/_organization/messenger')({
  component: Component,
  beforeLoad: () => ({ title: 'Tin nhắn' })
});
