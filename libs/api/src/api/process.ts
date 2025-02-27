import {
  Collections,
  ObjectResponse,
  ProcessResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

export type ProcessDbData = ProcessResponse<
  {},
  {
    object_via_process: ObjectResponse[];
  }
>;

export const processApi = router('process', {
  listFull: router.query({
    fetcher: () => {
      return client.collection<ProcessDbData>(Collections.Process).getFullList({
        expand: 'object_via_process'
      });
    }
  }),
  byId: router.query({
    fetcher: (id: string) => {
      return client.collection<ProcessDbData>(Collections.Process).getOne(id, {
        expand: 'object_via_process'
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
    mutationFn: (params: { processId: string; objectIds: string[] }) => {
      return client.send('/apply-process', {
        method: 'POST',
        body: params
      });
    }
  }),
  duplicate: router.mutation({
    mutationFn: (id: string) => {
      return client.send('/duplicate-process', {
        method: 'POST',
        body: {
          processId: id
        }
      });
    }
  })
});
