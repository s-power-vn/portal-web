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
import { objectApi, objectTypeApi, projectApi } from 'portal-api';

import { Show } from '@minhdtb/storeo-core';
import { Button } from '@minhdtb/storeo-theme';

import { Sidebar, SidebarGroup, SidebarItem } from '../../../components';
import { IssueBadge } from '../../../components/domains/issue/issue-badge';

export const Route = createFileRoute(
  '/_private/$organizationId/project/$projectId'
)({
  component: Component,
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient?.ensureQueryData(projectApi.byId.getOptions(projectId)),
  beforeLoad: ({ params }) => ({ title: params.projectId })
});

function Component() {
  const matchRoute = useMatchRoute();
  const params = matchRoute({
    to: '/$organizationId/project/$projectId/settings'
  });
  const { projectId, organizationId } = Route.useParams();
  const project = projectApi.byId.useSuspenseQuery({
    variables: projectId
  });
  const navigate = useNavigate({ from: '/$organizationId/project/$projectId' });

  const { data: requestType } = objectTypeApi.byType.useSuspenseQuery({
    variables: 'Request'
  });

  const { data: priceType } = objectTypeApi.byType.useSuspenseQuery({
    variables: 'Price'
  });

  const { data: requestObjects } = requestType
    ? objectApi.listFullActiveByType.useSuspenseQuery({
        variables: requestType.id
      })
    : { data: null };

  const { data: priceObjects } = priceType
    ? objectApi.listFullActiveByType.useSuspenseQuery({
        variables: priceType.id
      })
    : { data: null };

  const hasRequest = (requestObjects?.length ?? 0) > 0;
  const hasPrice = (priceObjects?.length ?? 0) > 0;

  return (
    <div className={'flex h-full flex-col'}>
      <div
        className={
          'flex h-[50px] w-full flex-shrink-0 items-center justify-between border-b p-1'
        }
      >
        <div className={'flex flex-1 flex-col truncate'}>
          <div className={'flex items-center'}>
            <span className={'text-muted-foreground truncate text-sm'}>
              {project.data?.name}
            </span>
          </div>
        </div>
        <div className={'p-2'}>
          <Button
            className={'flex h-8 w-8 items-center justify-center p-0'}
            onClick={() =>
              navigate({
                to: '/$organizationId/project/$projectId/settings',
                params: {
                  organizationId,
                  projectId
                }
              })
            }
          >
            <SettingsIcon className={'h-4 w-4'} />
          </Button>
        </div>
      </div>
      <div className={'flex flex-1 overflow-hidden'}>
        <Show
          when={params}
          fallback={
            <>
              <Sidebar uid={'project'} expanded={true}>
                {(hasRequest || hasPrice) && (
                  <SidebarGroup
                    to={'/$organizationId/project/$projectId/contract'}
                    icon={<NotebookPenIcon width={22} height={22} />}
                  >
                    <SidebarItem
                      to={'/$organizationId/project/$projectId/contract/input'}
                      icon={<NotebookTextIcon width={22} height={22} />}
                    ></SidebarItem>
                    <SidebarItem
                      to={
                        '/$organizationId/project/$projectId/contract/monitoring'
                      }
                      icon={<BarChart3Icon width={22} height={22} />}
                    ></SidebarItem>
                  </SidebarGroup>
                )}
                <SidebarGroup
                  to={'/$organizationId/project/$projectId/issues'}
                  icon={<BriefcaseBusinessIcon width={22} height={22} />}
                >
                  <SidebarItem
                    to={'/$organizationId/project/$projectId/issues/me'}
                    icon={<ListChecksIcon width={22} height={22} />}
                    badge={<IssueBadge projectId={projectId} />}
                  ></SidebarItem>
                  {hasRequest && (
                    <SidebarItem
                      to={'/$organizationId/project/$projectId/issues/request'}
                      isChild
                      icon={<LayoutListIcon width={22} height={22} />}
                    ></SidebarItem>
                  )}
                  {hasPrice && (
                    <SidebarItem
                      to={'/$organizationId/project/$projectId/issues/price'}
                      icon={<LayoutListIcon width={22} height={22} />}
                    ></SidebarItem>
                  )}
                </SidebarGroup>
              </Sidebar>
              <div className={'flex-1 overflow-auto'}>
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
}
