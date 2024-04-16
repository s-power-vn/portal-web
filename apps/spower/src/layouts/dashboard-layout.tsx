import { FileTextIcon, GearIcon } from '@radix-ui/react-icons';
import { LucideHome, PackagePlusIcon } from 'lucide-react';

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

const EmptyIcon = () => <span></span>;

const SidebarHeader = () => {
  const [openProjectNew, setOpenProjectNew] = useState(false);
  const { collapsed } = useSidebar();

  return (
    <div className={'flex w-full items-center justify-center border-b p-1'}>
      <NewProjectDialog
        open={openProjectNew}
        setOpen={setOpenProjectNew}
        screen={'mine'}
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
      <div className={'flex h-full w-full grow'}>
        <Sidebar>
          <SidebarHeader />
          <SidebarItem
            to={'/home'}
            icon={<LucideHome width={22} height={22} />}
          ></SidebarItem>
          <SidebarGroup
            to={'/general'}
            title={'Quản lý chung'}
            icon={<GearIcon width={22} height={22} />}
          >
            <SidebarItem
              to={'/general/employees'}
              icon={<EmptyIcon />}
            ></SidebarItem>
            <SidebarItem
              to={'/general/customers'}
              icon={<EmptyIcon />}
            ></SidebarItem>
            <SidebarItem
              to={'/general/suppliers'}
              icon={<EmptyIcon />}
            ></SidebarItem>
          </SidebarGroup>
          <SidebarItem
            to={'/project'}
            icon={<FileTextIcon width={22} height={22} />}
          ></SidebarItem>
        </Sidebar>
        <div className={'h-full grow overflow-hidden p-2'}>{children}</div>
      </div>
    </div>
  );
};
