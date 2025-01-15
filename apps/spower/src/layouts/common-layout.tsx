import type { FC, ReactNode } from 'react';

export type CommonLayoutProps = {
  children: ReactNode;
};

export const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  return (
    <div
      className={
        'bg-appGrayLight flex h-screen w-screen items-center justify-center'
      }
    >
      {children}
    </div>
  );
};
