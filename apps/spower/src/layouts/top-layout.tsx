import { FC, ReactNode } from 'react';

import { Header } from '../components';

export type TopLayoutProps = {
  children: ReactNode;
};

export const TopLayout: FC<TopLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className={'flex flex-1 flex-col overflow-hidden'}>{children}</div>
    </>
  );
};
