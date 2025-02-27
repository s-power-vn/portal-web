import {
  Collections,
  PriceDetailResponse,
  PriceResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

export type PriceDetailData = PriceDetailResponse<{
  prices: Record<string, number>;
}>;

export type PriceData = PriceResponse<{
  priceDetail_via_price: PriceDetailData[];
}>;

export const priceApi = router('price', {
  byIssueId: router.query({
    fetcher: async (issueId: string) => {
      try {
        return await client
          .collection<PriceData>(Collections.Price)
          .getFirstListItem(`issue = "${issueId}"`, {
            expand:
              'priceDetail_via_price,' +
              'issue.createdBy,' +
              'issue.createdBy.department,' +
              'issue.assignee,' +
              'project'
          });
      } catch (e) {
        console.log(e, issueId);
        return null;
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (params: {
      title: string;
      project: string;
      object: string;
      code: string;
      startDate?: Date;
      endDate?: Date;
      details?: {
        estimate?: number;
        index?: string;
        level?: string;
        title?: string;
        unit?: string;
        volume?: number;
        prices?: {
          [key: string]: number;
        };
      }[];
      attachments?: {
        id?: string;
        name?: string;
        size?: number;
        type?: string;
        file?: File;
        deleted?: boolean;
      }[];
    }) => {
      const { id } = await client.send('/create-price', {
        method: 'POST',
        body: params
      });

      for (const element of params?.attachments ?? []) {
        if (element.file) {
          const formData = new FormData();
          formData.append('issue', id);
          formData.append('name', element.name ?? '');
          formData.append('size', element.size?.toString() ?? '');
          formData.append('type', element.type ?? '');
          formData.append('upload', element.file);

          await client.collection(Collections.IssueFile).create(formData);
        }
      }
    }
  }),
  update: router.mutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      project: string;
      code: string;
      startDate?: Date;
      endDate?: Date;
      details?: {
        estimate?: number;
        index?: string;
        level?: string;
        title?: string;
        unit?: string;
        volume?: number;
        prices?: {
          [key: string]: number;
        };
      }[];
      deletedIds?: (string | undefined)[];
      attachments?: {
        id?: string;
        name?: string;
        size?: number;
        type?: string;
        file?: File;
        deleted?: boolean;
      }[];
    }) => {
      for (const element of params?.attachments ?? []) {
        if (element.deleted) {
          if (element.id) {
            await client.collection(Collections.IssueFile).delete(element.id);
          }
        } else if (element.file) {
          const formData = new FormData();
          formData.append('issue', params.id);
          formData.append('name', element.name ?? '');
          formData.append('size', element.size?.toString() ?? '');
          formData.append('type', element.type ?? '');
          formData.append('upload', element.file);

          await client.collection(Collections.IssueFile).create(formData);
        }
      }

      return client.send('/update-price', {
        method: 'POST',
        body: params
      });
    }
  })
});
