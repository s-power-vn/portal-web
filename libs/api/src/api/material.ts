import type { MaterialRecord } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from './types';

export const materialApi = router('material', {
  listFull: router.query({
    fetcher: () =>
      client.collection(Collections.Material).getFullList({
        sort: '-created'
      })
  }),
  list: router.query({
    fetcher: (params?: ListParams) => {
      const filter = `(name ~ "${params?.filter ?? ''}" || code ~ "${params?.filter ?? ''}")`;
      return client
        .collection(Collections.Material)
        .getList(params?.pageIndex ?? 1, params?.pageSize ?? 10, {
          filter,
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Material).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (params: Partial<MaterialRecord>) =>
      client.collection(Collections.Material).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: Partial<MaterialRecord> & { id: string }) =>
      client.collection(Collections.Material).update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Material).delete(id)
  })
});
