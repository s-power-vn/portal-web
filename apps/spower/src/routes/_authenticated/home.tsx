import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/home')({
  component: () => (
    <div className={'flex h-full w-full items-center justify-center'}></div>
  ),
  beforeLoad: () => {
    return {
      title: 'Trang chủ'
    };
  }
});
