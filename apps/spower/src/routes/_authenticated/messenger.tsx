import { createFileRoute } from '@tanstack/react-router';

import { PageHeader, PrivateChat } from '../../components';

const Component = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-none">
        <PageHeader title="Tin nhắn" />
      </div>
      <PrivateChat />
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/messenger')({
  component: Component,
  beforeLoad: () => ({ title: 'Tin nhắn' })
});
