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
  list: router.query({
    fetcher: (params?: ListParams) => {
      return client
        .collection<DepartmentData>(Collections.Department)
        .getList(params?.pageIndex ?? 1, params?.pageSize ?? 10, {
          filter: params?.filter,
          sort: '-created'
        });
    }
  }),
  listFull: router.query({
    fetcher: () => {
      return client
        .collection<DepartmentData>(Collections.Department)
        .getFullList();
    }
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<DepartmentData>(Collections.Department).getOne(id)
  }),
  byIds: router.query({
    fetcher: (ids: string[]) => {
      if (ids.length === 0) {
        return [];
      }

      return client
        .collection<DepartmentData>(Collections.Department)
        .getFullList({
          filter: `id ~ "${ids.join('" || id ~ "')}"`
        });
    }
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
