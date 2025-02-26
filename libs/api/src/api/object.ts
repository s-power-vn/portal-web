import {
  Collections,
  ObjectResponse,
  ProcessResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

export type ObjectData = ObjectResponse & {
  expand?: {
    process: ProcessResponse;
  };
};

export const objectApi = router('object', {
  listFull: router.query({
    fetcher: () =>
      client.collection<ObjectData>(Collections.Object).getFullList({
        expand: `process`
      })
  }),
  listFullActive: router.query({
    fetcher: () =>
      client.collection<ObjectData>(Collections.Object).getFullList({
        expand: `process`,
        filter: `active = true`
      })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ObjectData>(Collections.Object).getOne(id, {
        expand: `process`
      })
  }),
  create: router.mutation({
    mutationFn: (params: Partial<ObjectResponse>) =>
      client.collection<ObjectData>(Collections.Object).create(params)
  }),
  update: router.mutation({
    mutationFn: (params: Partial<ObjectResponse> & { id: string }) =>
      client
        .collection<ObjectData>(Collections.Object)
        .update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection<ObjectData>(Collections.Object).delete(id)
  }),
  duplicate: router.mutation({
    mutationFn: (id: string) =>
      client.send('/duplicate-object', {
        method: 'POST',
        body: {
          objectId: id
        }
      })
  }),
  actives: router.mutation({
    mutationFn: (ids: string[]) =>
      Promise.all(
        ids.map(id =>
          client.collection<ObjectData>(Collections.Object).update(id, {
            active: true
          })
        )
      )
  })
});
