import { Link, createFileRoute } from '@tanstack/react-router';
import { Loader } from 'lucide-react';

import React, { Suspense } from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@minhdtb/storeo-theme';

import { ProjectOverviewTab } from '../../../../../components';


const Component = () => {
  const { projectId } = Route.useParams();
  return (
    <Tabs defaultValue={'overview'}>
      <TabsList className="grid w-full flex-none grid-cols-4 rounded-none">
        <TabsTrigger value="overview" asChild>
          <Link
            to={'/project/$projectId/contract/monitoring'}
            params={{
              projectId
            }}
          >
            Theo dõi hợp đồng
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Suspense
          fallback={
            <div className={`p-2`}>
              <Loader className={'h-6 w-6 animate-spin'} />
            </div>
          }
        >
          <ProjectOverviewTab projectId={projectId} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};
export const Route = createFileRoute(
  '/_private/_organization/project/$projectId/contract/monitoring'
)({
  component: Component,
  beforeLoad: () => ({ title: 'Theo dõi hợp đồng' })
});
