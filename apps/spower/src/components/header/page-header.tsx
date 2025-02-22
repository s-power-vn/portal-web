import type { FC } from 'react';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export const PageHeader: FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className={'flex h-[2.57rem] w-full items-center gap-2 border-b p-2'}>
      <span className={'text-appBlue font-bold'}>{title}</span>
    </div>
  );
};
