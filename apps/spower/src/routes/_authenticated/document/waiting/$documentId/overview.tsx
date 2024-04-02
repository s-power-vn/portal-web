import { Link, createFileRoute } from '@tanstack/react-router';

import React, { Suspense } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@storeo/theme';

import { DocumentOverviewTab } from '../../../../../components';

const Component = () => {
  const { documentId } = Route.useParams();
  return (
    <Tabs defaultValue={'overview'}>
      <TabsList className="grid w-full flex-none grid-cols-4">
        <TabsTrigger value="overview" asChild>
          <Link to={'/document/waiting/$documentId/overview'}>Tổng quan</Link>
        </TabsTrigger>
        <TabsTrigger value="request" asChild>
          <Link to={'/document/waiting/$documentId/request'}>
            Yêu cầu mua hàng
          </Link>
        </TabsTrigger>
        <TabsTrigger value="contract">Hợp đồng NCC</TabsTrigger>
        <TabsTrigger value="delivery">Tài liệu bàn giao</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Suspense fallback={'Đang tải...'}>
          <DocumentOverviewTab documentId={documentId} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId/overview'
)({
  component: Component,
  beforeLoad: () => ({ title: 'Tổng quan' })
});
