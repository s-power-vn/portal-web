import { router } from 'react-query-kit';

import { Collections, CustomerRecord, client } from '@storeo/core';

import { Search } from './types';

export const customerApi = router('customer', {
  listFull: router.query({
    fetcher: (search?: string) => {
      const filter = `(name ~ "${search ?? ''}" || email ~ "${search ?? ''}")`;
      return client.collection(Collections.Customer).getFullList({
        filter,
        sort: '-created'
      });
    }
  }),
  list: router.query({
    fetcher: (search?: Search) => {
      const filter = `(name ~ "${search?.filter ?? ''}" || email ~ "${search?.filter ?? ''}")`;
      return client
        .collection(Collections.Customer)
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Customer).getOne(id)
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
