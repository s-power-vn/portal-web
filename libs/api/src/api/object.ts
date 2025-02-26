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
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<ObjectData>(Collections.Object).getOne(id, {
        expand: `process`
      })
  })
});
