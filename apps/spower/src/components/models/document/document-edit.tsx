import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { FC, Suspense } from 'react';

import { DocumentResponse, usePb } from '@storeo/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@storeo/theme';

import { DocumentContract } from './document-contract';
import { DocumentDelivery } from './document-delivery';
import { DocumentOverview } from './document-overview';
import { DocumentRequest } from './document-request';

function getDocument(id: string, pb?: PocketBase) {
  return pb?.collection<DocumentResponse>('document').getOne(id, {
    expand: 'customer'
  });
}

export function documentOptions(id: string, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['document', id],
    queryFn: () => getDocument(id, pb)
  });
}

export type DocumentEditProps = {
  documentId: string;
  defaultTab?: 'overview' | 'request' | 'contract' | 'delivery';
};

export const DocumentEdit: FC<DocumentEditProps> = ({
  documentId,
  defaultTab = 'overview'
}) => {
  const pb = usePb();
  const documentQuery = useSuspenseQuery(documentOptions(documentId, pb));
  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-col'}>
        <span className={'text-appBlack text-lg font-semibold'}>
          {documentQuery.data?.bidding}
        </span>
        <span className={'text-muted-foreground text-sm'}>
          {documentQuery.data?.name} -{' '}
          {
            (documentQuery.data?.expand as { customer: { name: string } })
              ?.customer.name
          }
        </span>
      </div>
      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid w-full flex-none grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="request">Yêu cầu mua hàng</TabsTrigger>
          <TabsTrigger value="contract">Hợp đồng NCC</TabsTrigger>
          <TabsTrigger value="delivery">Tài liệu bàn giao</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Suspense fallback={'Đang tải...'}>
            <DocumentOverview documentId={documentId} />
          </Suspense>
        </TabsContent>
        <TabsContent value="request">
          <Suspense fallback={'Đang tải...'}>
            <DocumentRequest documentId={documentId}/>
          </Suspense>
        </TabsContent>
        <TabsContent value="contract">
          <DocumentContract documentId={documentId} />
        </TabsContent>
        <TabsContent value="delivery">
          <DocumentDelivery documentId={documentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
