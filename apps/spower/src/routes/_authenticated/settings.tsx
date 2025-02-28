import { Outlet, createFileRoute } from '@tanstack/react-router';
import {
  AnvilIcon,
  BuildingIcon,
  FactoryIcon,
  GitBranchIcon,
  HandshakeIcon,
  PackageIcon,
  Users2Icon
} from 'lucide-react';

import { PageHeader, Sidebar, SidebarItem } from '../../components';

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
  beforeLoad: () => ({ title: 'Cài đặt' })
});

function Settings() {
  return (
    <div className={'flex h-full w-full flex-col'}>
      <PageHeader title={'Cài đặt'} />
      <div className={'flex h-full w-full'}>
        <Sidebar uid={'settings'} expanded={true}>
          <SidebarItem
            to={'/settings/employees'}
            icon={<Users2Icon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/settings/departments'}
            icon={<BuildingIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/settings/customers'}
            icon={<HandshakeIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/settings/suppliers'}
            icon={<FactoryIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/settings/materials'}
            icon={<AnvilIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/settings/objects'}
            icon={<PackageIcon width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/settings/process'}
            icon={<GitBranchIcon width={22} height={22} />}
          ></SidebarItem>
        </Sidebar>
        <div className={'w-full overflow-hidden'}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
