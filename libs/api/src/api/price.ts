import { client } from 'portal-core';

import { router } from 'react-query-kit';

export const priceApi = router('price', {
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
  })
});
