import {
  AnvilIcon,
  AreaChartIcon,
  BellDotIcon,
  FactoryIcon,
  GitBranchIcon,
  HandshakeIcon,
  HexagonIcon,
  PackagePlusIcon,
  SquareKanbanIcon,
  Users2Icon
} from 'lucide-react';
import { api } from 'portal-api';

import type { FC, ReactNode } from 'react';
import { useCallback } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Button, showModal } from '@minhdtb/storeo-theme';

import {
  Header,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  useSidebar
} from '../components';
import { IssueBadge } from '../components/domains/issue/issue-badge';
import { NewProjectForm } from '../components/domains/project/form/new-project-form';
import { useInvalidateQueries } from '../hooks';

const SidebarHeader = () => {
  const { collapsed } = useSidebar();
  const invalidates = useInvalidateQueries();

  const handleNewProject = useCallback(() => {
    showModal({
      title: 'Tạo dự án mới',
      children: ({ close }) => (
        <NewProjectForm
          onSuccess={() => {
            invalidates([api.project.list.getKey()]);
            close();
          }}
          onCancel={close}
        />
      )
    });
  }, [invalidates]);

  return (
    <div
      className={
        'flex h-[50px] w-full items-center justify-center border-b p-2'
      }
    >
      <Button
        className={cn(
          'flex w-full justify-center gap-2 bg-green-600 p-0 uppercase hover:bg-green-500',
          collapsed && 'gap-0'
        )}
        onClick={handleNewProject}
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
    <div className={'flex h-screen w-full flex-col overflow-hidden'}>
      <Header />
      <div className={'flex h-full w-full'}>
        <Sidebar uid={'dashboard'} expanded={true}>
          <SidebarHeader />
          <SidebarItem
            to={'/home'}
            icon={<AreaChartIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/notification'}
            icon={<BellDotIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarGroup
            to={'/general'}
            icon={<HexagonIcon width={22} height={22} />}
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
            <SidebarItem
              to={'/general/materials'}
              icon={<AnvilIcon />}
            ></SidebarItem>
          </SidebarGroup>
          <SidebarItem
            to={'/project'}
            icon={<SquareKanbanIcon width={22} height={22} />}
            badge={<IssueBadge isAll={true} />}
          ></SidebarItem>
          <SidebarItem
            to={'/process'}
            icon={<GitBranchIcon width={22} height={22} />}
          ></SidebarItem>
        </Sidebar>
        <div className={'w-full overflow-hidden'}>{children}</div>
      </div>
    </div>
  );
};
