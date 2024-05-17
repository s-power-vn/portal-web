import { createFileRoute } from '@tanstack/react-router';

const Component = () => {
  return <div className={'flex gap-2 p-2'}></div>;
};

export const Route = createFileRoute('/_authenticated/home')({
  component: Component,
  beforeLoad: () => {
    return {
      title: 'Trang chủ'
    };
  }
});
