import { GearIcon, HomeIcon } from '@radix-ui/react-icons';
import {
  FactoryIcon,
  HandshakeIcon,
  PackagePlusIcon,
  SquareKanbanIcon,
  Users2Icon
} from 'lucide-react';

import { FC, ReactNode, useState } from 'react';

import { cn } from '@storeo/core';
import {
  Button,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  useSidebar
} from '@storeo/theme';

import { Header, NewProjectDialog } from '../components';

const SidebarHeader = () => {
  const [openProjectNew, setOpenProjectNew] = useState(false);
  const { collapsed } = useSidebar();

  return (
    <div
      className={
        'flex h-[50px] w-full items-center justify-center border-b p-2'
      }
    >
      <NewProjectDialog
        open={openProjectNew}
        setOpen={setOpenProjectNew}
        search={{
          pageIndex: 1,
          pageSize: 10,
          filter: ''
        }}
      />
      <Button
        className={cn(
          'flex w-full justify-center gap-2 bg-green-600 p-0 uppercase hover:bg-green-500',
          collapsed && 'gap-0'
        )}
        onClick={() => setOpenProjectNew(true)}
      >
        <PackagePlusIcon />
        <span
          className={cn('transition-opacity', collapsed && `w-0 opacity-0`)}
        >
          Tạo dự án
        </span>
      </Button>
    </div>
  );
};

export type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className={'flex h-screen w-full flex-col'}>
      <Header />
      <div className={'flex h-full w-full'}>
        <Sidebar uid={'dashboard'}>
          <SidebarHeader />
          <SidebarItem
            to={'/home'}
            icon={<HomeIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarGroup
            to={'/general'}
            icon={<GearIcon width={22} height={22} />}
          >
            <SidebarItem
              to={'/general/employees'}
              icon={<Users2Icon />}
            ></SidebarItem>
            <SidebarItem
              to={'/general/customers'}
              icon={<HandshakeIcon />}
            ></SidebarItem>
            <SidebarItem
              to={'/general/suppliers'}
              icon={<FactoryIcon />}
            ></SidebarItem>
          </SidebarGroup>
          <SidebarItem
            to={'/project'}
            icon={<SquareKanbanIcon width={22} height={22} />}
          ></SidebarItem>
        </Sidebar>
        <div className={'h-full grow overflow-hidden'}>{children}</div>
      </div>
    </div>
  );
};
