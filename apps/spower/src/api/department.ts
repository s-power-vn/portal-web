import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

export const departmentApi = router('department', {
  listFull: router.query({
    fetcher: () =>
      client.collection(Collections.Department).getFullList({
        sort: '-created'
      })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection(Collections.Department).getOne(id)
  })
});
