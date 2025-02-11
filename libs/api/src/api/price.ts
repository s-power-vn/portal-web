import {
  Collections,
  PriceDetailResponse,
  PriceResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

export type PriceDetailData = PriceDetailResponse & {
  prices: Record<string, number>;
};

export type PriceData = PriceResponse & {
  expand: {
    priceDetail_via_price: PriceDetailData[];
  };
};

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
    }) => {
      return client.send('/create-price', {
        method: 'POST',
        body: params
      });
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
    }) => {
      return client.send('/update-price', {
        method: 'POST',
        body: params
      });
    }
  })
});
