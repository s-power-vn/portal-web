import { Link, createFileRoute } from '@tanstack/react-router';

import React, { Suspense } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@storeo/theme';

import { DocumentOverviewTab } from '../../../../components';

const Component = () => {
  const { projectId } = Route.useParams();
  return (
    <Tabs defaultValue={'overview'}>
      <TabsList className="grid w-full flex-none grid-cols-4">
        <TabsTrigger value="overview" asChild>
          <Link to={'/project/$projectId/overview'}>Tổng quan</Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Suspense fallback={'Đang tải...'}>
          <DocumentOverviewTab projectId={projectId} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export const Route = createFileRoute(
  '/_authenticated/project/$projectId/overview'
)({
  component: Component,
  beforeLoad: () => ({ title: 'Tổng quan' })
});
