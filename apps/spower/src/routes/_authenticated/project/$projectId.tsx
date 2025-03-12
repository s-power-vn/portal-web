import {
  Outlet,
  createFileRoute,
  useMatchRoute,
  useNavigate
} from '@tanstack/react-router';
import {
  BarChart3Icon,
  BriefcaseBusinessIcon,
  LayoutListIcon,
  ListChecksIcon,
  NotebookPenIcon,
  NotebookTextIcon,
  SettingsIcon
} from 'lucide-react';
import { api } from 'portal-api';

import { Show } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import { Sidebar, SidebarGroup, SidebarItem } from '../../../components';
import { IssueBadge } from '../../../components/domains/issue/issue-badge';

// Create a temporary variable to use within the component
const ThisRoute = createFileRoute('/_authenticated/project/$projectId')();

const Component = () => {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/project/$projectId/settings' });
  const { projectId } = ThisRoute.useParams();
  const project = api.project.byId.useSuspenseQuery({
    variables: projectId
  });
  const navigate = useNavigate({ from: '/project/$projectId' });

  // Truy vấn trực tiếp các object types theo tên
  const { data: requestType } = api.objectType.byType.useSuspenseQuery({
    variables: 'Request'
  });

  const { data: priceType } = api.objectType.byType.useSuspenseQuery({
    variables: 'Price'
  });

  // Kiểm tra có tồn tại object thuộc loại Request không
  const { data: requestObjects } = requestType
    ? api.object.listActive.useSuspenseQuery({
        variables: {
          filter: `type = "${requestType.id}"`,
          pageIndex: 1,
          pageSize: 1
        }
      })
    : { data: null };

  // Kiểm tra có tồn tại object thuộc loại Price không
  const { data: priceObjects } = priceType
    ? api.object.listActive.useSuspenseQuery({
        variables: {
          filter: `type = "${priceType.id}"`,
          pageIndex: 1,
          pageSize: 1
        }
      })
    : { data: null };

  const hasRequest = (requestObjects?.totalItems ?? 0) > 0;
  const hasPrice = (priceObjects?.totalItems ?? 0) > 0;

  return (
    <div className={'flex h-full flex-col'}>
      <div
        className={
          'flex h-[50px] w-full flex-shrink-0 items-center justify-between border-b p-1'
        }
      >
        <div className={'flex flex-1 flex-col truncate'}>
          <span className={'text-appBlack truncate font-semibold'}>
            {project.data?.bidding}
          </span>
          <div className={'flex items-center'}>
            <span className={'text-muted-foreground truncate text-sm'}>
              {project.data?.name} - {project.data?.expand?.customer.name}
            </span>
          </div>
        </div>
        <div className={'p-2'}>
          <Button
            className={'flex h-8 w-8 items-center justify-center p-0'}
            onClick={() =>
              navigate({
                to: '/project/$projectId/settings',
                params: {
                  projectId
                }
              })
            }
          >
            <SettingsIcon className={'h-4 w-4'} />
          </Button>
        </div>
      </div>
      <div className={'flex w-full flex-1 overflow-hidden'}>
        <Show
          when={params}
          fallback={
            <>
              <Sidebar uid={'project'} expanded={true}>
                {(hasRequest || hasPrice) && (
                  <SidebarGroup
                    to={'/project/$projectId/contract'}
                    icon={<NotebookPenIcon width={22} height={22} />}
                  >
                    <SidebarItem
                      to={'/project/$projectId/contract/input'}
                      icon={<NotebookTextIcon width={22} height={22} />}
                    ></SidebarItem>
                    <SidebarItem
                      to={'/project/$projectId/contract/monitoring'}
                      icon={<BarChart3Icon width={22} height={22} />}
                    ></SidebarItem>
                  </SidebarGroup>
                )}
                <SidebarGroup
                  to={'/project/$projectId/issues'}
                  icon={<BriefcaseBusinessIcon width={22} height={22} />}
                >
                  <SidebarItem
                    to={'/project/$projectId/issues/me'}
                    icon={<ListChecksIcon width={22} height={22} />}
                    badge={<IssueBadge projectId={projectId} />}
                  ></SidebarItem>
                  {hasRequest && (
                    <SidebarItem
                      to={'/project/$projectId/issues/request'}
                      isChild
                      icon={<LayoutListIcon width={22} height={22} />}
                    ></SidebarItem>
                  )}
                  {hasPrice && (
                    <SidebarItem
                      to={'/project/$projectId/issues/price'}
                      icon={<LayoutListIcon width={22} height={22} />}
                    ></SidebarItem>
                  )}
                </SidebarGroup>
              </Sidebar>
              <div className={'flex min-h-0 flex-1 flex-col'}>
                <div className={'flex-1 overflow-auto'}>
                  <Outlet />
                </div>
              </div>
            </>
          }
        >
          <Outlet />
        </Show>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/project/$projectId')({
  component: Component,
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient?.ensureQueryData(api.project.byId.getOptions(projectId)),
  beforeLoad: ({ params }) => ({ title: params.projectId })
});
