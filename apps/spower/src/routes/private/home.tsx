import { createFileRoute } from '@tanstack/react-router';
import { BlocksIcon } from 'lucide-react';

const Component = () => {
  return (
    <div className={'flex h-full w-full items-center justify-center'}>
      <div
        className={
          'text-appBlueLight flex flex-col items-center justify-center gap-3'
        }
      >
        <BlocksIcon className={'h-16 w-16'} />
        <h1>Trang này đang được xây dựng</h1>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_private/home')({
  component: Component,
  beforeLoad: () => {
    return {
      title: 'Trang chủ'
    };
  }
});
