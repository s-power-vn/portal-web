import {
  Collections,
  ProcessRecord,
  ProcessResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

export const processApi = router('process', {
  listFull: router.query({
    fetcher: () => {
      return client
        .collection<ProcessResponse>(Collections.Process)
        .getFullList();
    }
  }),
  create: router.mutation({
    mutationFn: (data: ProcessRecord) => {
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
  })
});
