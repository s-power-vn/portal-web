import { Link, createFileRoute } from '@tanstack/react-router';

import React, { Suspense } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@storeo/theme';

import { DocumentDeliveryTab } from '../../../../../components';

const Component = () => {
  const { documentId } = Route.useParams();
  return (
    <Tabs defaultValue={'delivery'}>
      <TabsList className="grid w-full flex-none grid-cols-4">
        <TabsTrigger value="overview" asChild>
          <Link to={'/document/waiting/$documentId/overview'}>Tổng quan</Link>
        </TabsTrigger>
        <TabsTrigger value="request" asChild>
          <Link to={'/document/waiting/$documentId/request'}>
            Yêu cầu mua hàng
          </Link>
        </TabsTrigger>
        <TabsTrigger value="contract" asChild>
          <Link to={'/document/waiting/$documentId/contract'}>
            Hợp đồng NCC
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="delivery">
        <Suspense fallback={'Đang tải...'}>
          <DocumentDeliveryTab documentId={documentId} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId/delivery'
)({
  component: Component,
  beforeLoad: () => ({ title: 'Tài liệu bàn giao' })
});
