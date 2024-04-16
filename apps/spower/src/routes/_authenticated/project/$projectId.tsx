import { FileTextIcon } from '@radix-ui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { LucideHome } from 'lucide-react';

import { Sidebar, SidebarItem } from '@storeo/theme';

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
        <Sidebar>
          <SidebarItem
            to={'/home'}
            icon={<LucideHome width={22} height={22} />}
          ></SidebarItem>
          <SidebarItem
            to={'/project'}
            icon={<FileTextIcon width={22} height={22} />}
          ></SidebarItem>
        </Sidebar>
        <div className={'h-full grow overflow-hidden p-2'}>
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
