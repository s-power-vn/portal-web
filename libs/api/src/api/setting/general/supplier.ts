import type { SupplierRecord } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

export const supplierApi = router('supplier', {
  list: router.query({
    fetcher: (params?: ListParams) => {
      const filter = `(name ~ "${params?.filter ?? ''}" || email ~ "${params?.filter ?? ''}")`;
      return client
        .collection(Collections.Supplier)
        .getList(params?.pageIndex ?? 1, params?.pageSize ?? 10, {
          filter,
          sort: '-created'
        });
    }
  }),
  listByIds: router.query({
    fetcher: (ids: string[]) =>
      client.collection(Collections.Supplier).getFullList({
        filter: ids.map(id => `id = "${id}"`).join(' || '),
        sort: '-created'
      })
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Supplier).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (params: Partial<SupplierRecord>) =>
      client.collection(Collections.Supplier).create({
        name: params.name,
        email: params.email,
        phone: params.phone,
        address: params.address
      })
  }),
  update: router.mutation({
    mutationFn: (params: Partial<SupplierRecord> & { id: string }) =>
      client.collection(Collections.Supplier).update(params.id, {
        name: params.name,
        email: params.email,
        phone: params.phone,
        address: params.address
      })
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Supplier).delete(id)
  })
});
