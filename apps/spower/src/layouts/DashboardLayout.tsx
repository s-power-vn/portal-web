import { FC, ReactNode } from 'react';

import { SideBar, SideBarGroup, SideBarItem } from '@storeo/theme';

const HomeIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256M400 179V64h-48v69"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};

const DocumentIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        d="M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M256 56v120a32 32 0 0032 32h120M176 288h160M176 368h160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  );
};

export type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className={'text-appBlue flex h-screen w-screen'}>
      <SideBar>
        <SideBarItem
          to={'/home'}
          title={'Home'}
          icon={<HomeIcon />}
        ></SideBarItem>
        <SideBarGroup to={'/tickets'} title={'Tickets'} icon={<DocumentIcon />}>
          <SideBarItem
            to={'/tickets/type1'}
            title={'Tickets Type 1'}
            icon={<DocumentIcon />}
          ></SideBarItem>
          <SideBarItem
            to={'/tickets/type2'}
            title={'Tickets Type 2'}
            icon={<DocumentIcon />}
          ></SideBarItem>
        </SideBarGroup>
      </SideBar>
      <div className={'h-full w-full'}>{children}</div>
    </div>
  );
};
