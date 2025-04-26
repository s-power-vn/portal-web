import { router } from 'react-query-kit';

import { CreatePriceInput, PriceItem, UpdatePriceInput } from './price.type';

export const priceApi = router('price', {
  byIssueId: router.query({
    fetcher: async (issueId: string): Promise<PriceItem | undefined> => {
      return;
    }
  }),
  create: router.mutation({
    mutationFn: async (params: CreatePriceInput): Promise<void> => {
      return;
    }
  }),
  update: router.mutation({
    mutationFn: async (params: UpdatePriceInput): Promise<void> => {
      return;
    }
  })
});
