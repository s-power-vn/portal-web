import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/home')({
  component: () => (
    <div className={'flex h-full w-full items-center justify-center'}></div>
  )
});
