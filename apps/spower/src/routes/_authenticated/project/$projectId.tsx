import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import {
  BarChart3Icon,
  BriefcaseBusinessIcon,
  LayoutListIcon,
  ListChecksIcon
} from 'lucide-react';

import { Sidebar, SidebarGroup, SidebarItem } from '@storeo/theme';

import { getProjectById } from '../../../api';

const Component = () => {
  const { projectId } = Route.useParams();
  const project = useSuspenseQuery(getProjectById(projectId));

  return (
    <div className={'flex h-full flex-col'}>
      <div
        className={
          'flex h-[50px] flex-none flex-col justify-center border-b p-1'
        }
      >
        <span className={'text-appBlack font-semibold'}>
          {project.data?.bidding}
        </span>
        <span className={'text-muted-foreground text-sm'}>
          {project.data?.name} - {project.data?.expand.customer.name}
        </span>
      </div>
      <div className={'flex h-full w-full'}>
        <Sidebar uid={'project'}>
          <SidebarItem
            to={'/project/$projectId/overview'}
            icon={<BarChart3Icon width={22} height={22} />}
          ></SidebarItem>
          <SidebarGroup
            to={'/project/$projectId/issues'}
            icon={<BriefcaseBusinessIcon width={22} height={22} />}
          >
            <SidebarItem
              to={'/project/$projectId/issues/me'}
              icon={<ListChecksIcon width={22} height={22} />}
            ></SidebarItem>
            <SidebarItem
              to={'/project/$projectId/issues/all'}
              icon={<LayoutListIcon width={22} height={22} />}
            ></SidebarItem>
          </SidebarGroup>
        </Sidebar>
        <div className={'h-full grow overflow-hidden'}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/project/$projectId')({
  component: Component,
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient?.ensureQueryData(getProjectById(projectId)),
  beforeLoad: ({ params }) => ({ title: params.projectId })
});
