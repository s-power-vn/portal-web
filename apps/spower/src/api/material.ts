import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import { Collections, MaterialRecord, client } from '@storeo/core';

export const MaterialsSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type MaterialsSearch = InferType<typeof MaterialsSearchSchema>;

export const materialApi = router('material', {
  listFull: router.query({
    fetcher: () =>
      client.collection(Collections.Material).getFullList({
        sort: '-created'
      })
  }),
  list: router.query({
    fetcher: (search?: MaterialsSearch) => {
      const filter = `(name ~ "${search?.filter ?? ''}" || code ~ "${search?.filter ?? ''}")`;
      return client
        .collection(Collections.Material)
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => client.collection(Collections.Material).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (params: MaterialRecord) =>
      client.collection(Collections.Material).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: MaterialRecord & { id: string }) =>
      client.collection(Collections.Material).update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Material).delete(id)
  })
});
