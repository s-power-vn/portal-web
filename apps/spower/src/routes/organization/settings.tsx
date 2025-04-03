import { Outlet, createFileRoute } from '@tanstack/react-router';
import {
  AnvilIcon,
  BriefcaseBusinessIcon,
  ComponentIcon,
  FactoryIcon,
  GitBranchIcon,
  HandshakeIcon,
  NetworkIcon,
  PackageIcon,
  Users2Icon
} from 'lucide-react';

import {
  PageHeader,
  Sidebar,
  SidebarGroup,
  SidebarItem
} from '../../components';

export const Route = createFileRoute('/_private/_organization/settings')({
  component: Settings,
  beforeLoad: () => ({ title: 'Cài đặt' })
});

function Settings() {
  return (
    <div className={'flex h-full w-full flex-col'}>
      <PageHeader title={'Cài đặt'} />
      <div className={'flex h-full w-full'}>
        <Sidebar uid={'settings'} expanded={true}>
          <SidebarGroup
            to={'/settings/general'}
            icon={<ComponentIcon width={22} height={22} />}
          >
            <SidebarItem
              to={'/settings/general/departments'}
              icon={<NetworkIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/settings/general/employees'}
              icon={<Users2Icon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/settings/general/customers'}
              icon={<HandshakeIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/settings/general/suppliers'}
              icon={<FactoryIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/settings/general/materials'}
              icon={<AnvilIcon width={22} height={22} />}
            ></SidebarItem>
          </SidebarGroup>
          <SidebarGroup
            to={'/settings/operation'}
            icon={<BriefcaseBusinessIcon width={22} height={22} />}
          >
            <SidebarItem
              to={'/settings/operation/objects'}
              icon={<PackageIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/settings/operation/process'}
              icon={<GitBranchIcon width={22} height={22} />}
            ></SidebarItem>
          </SidebarGroup>
        </Sidebar>
        <div className={'w-full overflow-hidden'}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
