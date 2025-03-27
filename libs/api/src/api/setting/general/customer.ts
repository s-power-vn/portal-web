import type { CustomerRecord } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

export const customerApi = router('customer', {
  list: router.query({
    fetcher: ({ pageIndex = 1, pageSize = 10, filter }: ListParams) => {
      return client
        .collection(Collections.Customer)
        .getList(pageIndex, pageSize, {
          filter,
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Customer).getOne(id)
  }),
  byIds: router.query({
    fetcher: (ids: string[]) => {
      if (ids.length === 0) {
        return [];
      }

      return client.collection(Collections.Customer).getFullList({
        filter: `id ~ "${ids.join('" || id ~ "')}"`
      });
    }
  }),
  create: router.mutation({
    mutationFn: (params: CustomerRecord) =>
      client.collection(Collections.Customer).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: CustomerRecord & { id: string }) =>
      client.collection(Collections.Customer).update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Customer).delete(id)
  })
});
