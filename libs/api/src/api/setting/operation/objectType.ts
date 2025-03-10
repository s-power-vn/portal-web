import { Collections, ObjectTypeResponse, client } from 'portal-core';

import { router } from 'react-query-kit';

export type ObjectTypeData = ObjectTypeResponse;

export const objectTypeApi = router('objectType', {
  listFull: router.query({
    fetcher: () =>
      client.collection<ObjectTypeData>(Collections.ObjectType).getFullList()
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ObjectTypeData>(Collections.ObjectType).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (params: Partial<ObjectTypeResponse>) =>
      client.collection<ObjectTypeData>(Collections.ObjectType).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: Partial<ObjectTypeResponse> & { id: string }) =>
      client
        .collection<ObjectTypeData>(Collections.ObjectType)
        .update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection<ObjectTypeData>(Collections.ObjectType).delete(id)
  })
});
