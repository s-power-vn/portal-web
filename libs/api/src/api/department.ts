import { Collections, DepartmentResponse, client } from 'portal-core';

import { router } from 'react-query-kit';

export type DepartmentData = DepartmentResponse<
  {
    id: string;
    name: string;
  }[]
>;

export const departmentApi = router('department', {
  listFull: router.query({
    fetcher: () =>
      client.collection<DepartmentData>(Collections.Department).getFullList({
        sort: '-created'
      })
  }),
  list: router.query({
    fetcher: () =>
      client.collection<DepartmentData>(Collections.Department).getList(1, 10, {
        sort: '-created'
      })
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<DepartmentData>(Collections.Department).getOne(id)
  })
});
