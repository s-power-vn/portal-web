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

export const Route = createFileRoute('/_private/$organizationId/settings')({
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
            to={'/$organizationId/settings/general'}
            icon={<ComponentIcon width={22} height={22} />}
          >
            <SidebarItem
              to={'/$organizationId/settings/general/departments'}
              icon={<NetworkIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/$organizationId/settings/general/employees'}
              icon={<Users2Icon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/$organizationId/settings/general/customers'}
              icon={<HandshakeIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/$organizationId/settings/general/suppliers'}
              icon={<FactoryIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/$organizationId/settings/general/materials'}
              icon={<AnvilIcon width={22} height={22} />}
            ></SidebarItem>
          </SidebarGroup>
          <SidebarGroup
            to={'/$organizationId/settings/operation'}
            icon={<BriefcaseBusinessIcon width={22} height={22} />}
          >
            <SidebarItem
              to={'/$organizationId/settings/operation/objects'}
              icon={<PackageIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/$organizationId/settings/operation/process'}
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
