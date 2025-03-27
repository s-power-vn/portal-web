import type { MaterialRecord } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

export const materialApi = router('material', {
  list: router.query({
    fetcher: ({ pageIndex = 1, pageSize = 10, filter }: ListParams) => {
      return client
        .collection(Collections.Material)
        .getList(pageIndex, pageSize, {
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
      client.collection(Collections.Material).create({
        name: params.name,
        code: params.code,
        unit: params.unit
      })
  }),
  update: router.mutation({
    mutationFn: (params: Partial<MaterialRecord> & { id: string }) =>
      client.collection(Collections.Material).update(params.id, {
        name: params.name,
        code: params.code,
        unit: params.unit
      })
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Material).delete(id)
  })
});
