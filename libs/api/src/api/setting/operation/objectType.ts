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
  })
});
