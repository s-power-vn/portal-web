import {
  AreaChartIcon,
  MessageSquareTextIcon,
  PackagePlusIcon,
  SettingsIcon,
  SquareKanbanIcon
} from 'lucide-react';
import { api } from 'portal-api';

import type { FC, ReactNode } from 'react';
import { useCallback } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Button, showModal } from '@minhdtb/storeo-theme';

import {
  Header,
  MessengerBadge,
  Sidebar,
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
        'flex h-[2.57rem] w-full items-center justify-center border-b p-[0.3rem]'
      }
    >
      <Button
        className={cn(
          'flex h-full w-full justify-center gap-2 bg-green-600 p-0 uppercase hover:bg-green-500',
          collapsed && 'gap-0'
        )}
        onClick={handleNewProject}
      >
        <PackagePlusIcon className={'h-5 w-5'} />
        <span
          className={cn('transition-opacity', collapsed && `w-0 opacity-0`)}
        >
          Tạo dự án
        </span>
      </Button>
    </div>
  );
};

export type OrganizationLayoutProps = {
  children: ReactNode;
};

export const OrganizationLayout: FC<OrganizationLayoutProps> = ({
  children
}) => {
  return (
    <>
      <Header />
      <div className={'flex flex-1 overflow-hidden'}>
        <Sidebar uid={'project'} expanded={true} collapsed={true}>
          <SidebarHeader />
          <SidebarItem
            to={'/home'}
            icon={<AreaChartIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/messenger'}
            icon={<MessageSquareTextIcon width={22} height={22} />}
            badge={<MessengerBadge />}
          ></SidebarItem>
          <SidebarItem
            to={'/project'}
            icon={<SquareKanbanIcon width={22} height={22} />}
            badge={<IssueBadge isAll={true} />}
          ></SidebarItem>
          <SidebarItem
            to={'/settings'}
            icon={<SettingsIcon width={22} height={22} />}
          ></SidebarItem>
        </Sidebar>
        <div className={'flex flex-1 flex-col overflow-hidden'}>{children}</div>
      </div>
    </>
  );
};
