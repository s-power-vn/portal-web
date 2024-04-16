import { useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, createFileRoute } from '@tanstack/react-router';

import { getProjectById } from '../../../api';

const Component = () => {
  const { projectId } = Route.useParams();
  const project = useSuspenseQuery(getProjectById(projectId));

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-col'}>
        <span className={'text-appBlack text-lg font-semibold'}>
          {project.data?.bidding}
        </span>
        <span className={'text-muted-foreground text-sm'}>
          {project.data?.name} - {project.data?.expand.customer.name}
        </span>
      </div>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute('/_authenticated/project/$projectId')({
  component: Component,
  loader: ({ context: { queryClient }, params: { projectId } }) =>
    queryClient?.ensureQueryData(getProjectById(projectId)),
  beforeLoad: ({ params }) => ({ title: params.projectId })
});
