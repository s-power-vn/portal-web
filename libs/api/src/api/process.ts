import { Collections, ProcessResponse, client } from 'portal-core';

import { router } from 'react-query-kit';

export const processApi = router('process', {
  listFull: router.query({
    fetcher: () => {
      return client
        .collection<ProcessResponse>(Collections.Process)
        .getFullList();
    }
  }),
  byId: router.query({
    fetcher: (id: string) => {
      return client.collection<ProcessResponse>(Collections.Process).getOne(id);
    }
  }),
  byType: router.query({
    fetcher: (objectId: string) => {
      return client
        .collection<ProcessResponse>(Collections.Process)
        .getFirstListItem(objectId, {
          filter: `type = "${objectId}"`
        });
    }
  }),
  create: router.mutation({
    mutationFn: (data: Partial<ProcessResponse>) => {
      return client
        .collection<ProcessResponse>(Collections.Process)
        .create(data);
    }
  }),
  update: router.mutation({
    mutationFn: ({
      id,
      ...data
    }: Partial<ProcessResponse> & { id: string }) => {
      return client
        .collection<ProcessResponse>(Collections.Process)
        .update(id, data);
    }
  }),
  delete: router.mutation({
    mutationFn: (id: string) => {
      return client.collection<ProcessResponse>(Collections.Process).delete(id);
    }
  }),
  apply: router.mutation({
    mutationFn: ({ id, type }: { id: string; type: 'Request' | 'Price' }) => {
      return client
        .collection<ProcessResponse>(Collections.Process)
        .update(id, {
          type
        });
    }
  })
});
