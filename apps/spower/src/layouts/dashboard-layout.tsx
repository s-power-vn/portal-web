import { useQueryClient } from '@tanstack/react-query';
import {
  AnvilIcon,
  AreaChartIcon,
  BellDotIcon,
  FactoryIcon,
  HandshakeIcon,
  HexagonIcon,
  PackagePlusIcon,
  SquareKanbanIcon,
  Users2Icon
} from 'lucide-react';
import { projectApi } from 'portal-api';

import { FC, ReactNode, useCallback, useRef } from 'react';

import { cn } from '@minhdtb/storeo-core';
import { Button, closeModal, showModal } from '@minhdtb/storeo-theme';

import {
  Header,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  useSidebar
} from '../components';
import { NewProjectForm } from '../components/models/project/new-project-form';

const SidebarHeader = () => {
  const queryClient = useQueryClient();
  const { collapsed } = useSidebar();
  const modalId = useRef<string | undefined>();

  const onSuccessHandler = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: projectApi.list.getKey()
      })
    ]);
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, [queryClient]);

  const onCancelHandler = useCallback(() => {
    if (modalId.current) {
      closeModal(modalId.current);
    }
  }, []);

  const handleNewProject = useCallback(() => {
    modalId.current = showModal({
      title: 'Tạo dự án mới',
      children: (
        <NewProjectForm
          onSuccess={onSuccessHandler}
          onCancel={onCancelHandler}
        />
      )
    });
  }, [onCancelHandler, onSuccessHandler]);

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
          ></SidebarItem>
        </Sidebar>
        <div className={'w-full overflow-hidden'}>{children}</div>
      </div>
    </div>
  );
};
