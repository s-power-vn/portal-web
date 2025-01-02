import { Collections, SupplierRecord, client } from 'portal-core';

import { router } from 'react-query-kit';

import { Search } from './types';

export const supplierApi = router('supplier', {
  listFull: router.query({
    fetcher: () =>
      client.collection(Collections.Supplier).getFullList({
        sort: '-created'
      })
  }),
  list: router.query({
    fetcher: (search?: Search) => {
      const filter = `(name ~ "${search?.filter ?? ''}" || email ~ "${search?.filter ?? ''}")`;
      return client
        .collection(Collections.Supplier)
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Supplier).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (params: SupplierRecord) =>
      client.collection(Collections.Supplier).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: SupplierRecord & { id: string }) =>
      client.collection(Collections.Supplier).update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Supplier).delete(id)
  })
});
