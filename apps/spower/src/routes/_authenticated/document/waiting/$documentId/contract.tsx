import { Link, createFileRoute } from '@tanstack/react-router';

import React, { Suspense } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@storeo/theme';

import { DocumentContractTab } from '../../../../../components';

const Component = () => {
  const { documentId } = Route.useParams();
  return (
    <Tabs defaultValue={'contract'}>
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
        <TabsTrigger value="delivery" asChild>
          <Link to={'/document/waiting/$documentId/delivery'}>
            Tài liệu bàn giao
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="contract">
        <Suspense fallback={'Đang tải...'}>
          <DocumentContractTab documentId={documentId} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export const Route = createFileRoute(
  '/_authenticated/document/waiting/$documentId/contract'
)({
  component: Component,
  beforeLoad: () => ({ title: 'Hợp đồng NCC' })
});
