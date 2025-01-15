import { useQueryClient } from '@tanstack/react-query';
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
import { Collections, client } from 'portal-core';

import { useEffect } from 'react';

import { Show } from '@minhdtb/storeo-core';
import { Badge, Button } from '@minhdtb/storeo-theme';

import { Sidebar, SidebarGroup, SidebarItem } from '../../../components';

const Component = () => {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: '/project/$projectId/settings' });
  const { projectId } = Route.useParams();
  const project = api.project.byId.useSuspenseQuery({
    variables: projectId
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: Route.fullPath });

  const requestUserInfo = api.request.userInfo.useSuspenseQuery({
    variables: projectId
  });

  useEffect(() => {
    client.collection(Collections.Request).subscribe('*', () =>
      queryClient.invalidateQueries({
        queryKey: api.request.userInfo.getKey(projectId)
      })
    );

    return () => {
      client.collection(Collections.Request).unsubscribe();
    };
  }, [projectId, queryClient]);

  return (
    <div className={'flex h-full flex-col'}>
      <div
        className={
          'flex h-[50px] w-full items-center justify-between border-b p-1'
        }
      >
        <div className={'flex flex-1 flex-col truncate'}>
          <span className={'text-appBlack truncate font-semibold'}>
            {project.data?.bidding}
          </span>
          <div className={'flex items-center'}>
            <span className={'text-muted-foreground truncate text-sm'}>
              {project.data?.name} - {project.data?.expand.customer.name}
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
      <div className={'flex h-full w-full'}>
        <Show
          when={params}
          fallback={
            <>
              <Sidebar uid={'project'} expanded={true}>
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
                <SidebarGroup
                  to={'/project/$projectId/issues'}
                  icon={<BriefcaseBusinessIcon width={22} height={22} />}
                >
                  <SidebarItem
                    to={'/project/$projectId/issues/me'}
                    icon={<ListChecksIcon width={22} height={22} />}
                    badge={
                      <Show when={requestUserInfo.data?.count}>
                        <Badge
                          className={
                            'bg-appErrorLight pointer-events-none mr-1'
                          }
                        >
                          {requestUserInfo.data?.count}
                        </Badge>
                      </Show>
                    }
                  ></SidebarItem>
                  <SidebarItem
                    to={'/project/$projectId/issues/request'}
                    icon={<LayoutListIcon width={22} height={22} />}
                  ></SidebarItem>
                  <SidebarItem
                    to={'/project/$projectId/issues/price'}
                    icon={<LayoutListIcon width={22} height={22} />}
                  ></SidebarItem>
                </SidebarGroup>
              </Sidebar>
              <div className={'max-h-[calc(100vh-6rem)] w-full overflow-auto'}>
                <Outlet />
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
