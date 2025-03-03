import {
  Collections,
  DepartmentRecord,
  DepartmentResponse,
  client
} from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

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
    fetcher: (params?: ListParams) => {
      const filter = params?.filter ? `name ~ "${params.filter}"` : '';
      return client
        .collection<DepartmentData>(Collections.Department)
        .getList(params?.pageIndex ?? 1, params?.pageSize ?? 10, {
          filter,
          sort: '-created'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<DepartmentData>(Collections.Department).getOne(id)
  }),
  create: router.mutation({
    mutationFn: (params: Partial<DepartmentRecord>) =>
      client.collection(Collections.Department).create({
        name: params.name,
        description: params.description,
        roles: params.roles
      })
  }),
  update: router.mutation({
    mutationFn: (params: Partial<DepartmentRecord> & { id: string }) =>
      client.collection(Collections.Department).update(params.id, {
        name: params.name,
        description: params.description,
        roles: params.roles
      })
  }),
  delete: router.mutation({
    mutationFn: (id: string) =>
      client.collection(Collections.Department).delete(id)
  })
});
