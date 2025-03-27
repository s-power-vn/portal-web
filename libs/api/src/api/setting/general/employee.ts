import type { DepartmentResponse, UserRecord, UserResponse } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { ListParams } from '../../types';

export type UserData = UserResponse<{
  department: DepartmentResponse;
}>;

export const employeeApi = router('employee', {
  list: router.query({
    fetcher: ({ pageIndex = 1, pageSize = 10, filter }: ListParams) => {
      return client
        .collection<UserData>(Collections.User)
        .getList(pageIndex, pageSize, {
          filter,
          sort: 'department',
          expand: 'department'
        });
    }
  }),
  listFull: router.query({
    fetcher: ({ filter }: { filter?: string }) => {
      return client.collection<UserData>(Collections.User).getFullList({
        filter
      });
    }
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<UserData>(Collections.User).getOne(id, {
        expand: 'department'
      })
  }),
  byIds: router.query({
    fetcher: (ids: string[]) => {
      if (ids.length === 0) {
        return [];
      }

      return client.collection<UserData>(Collections.User).getFullList({
        filter: `id ~ "${ids.join('" || id ~ "')}"`
      });
    }
  }),
  create: router.mutation({
    mutationFn: (params: Partial<UserRecord> & { password: string }) =>
      client.send('/employee/create', {
        method: 'POST',
        body: params
      })
  }),
  update: router.mutation({
    mutationFn: (params: Partial<UserRecord> & { id: string }) =>
      client.collection(Collections.User).update(params.id, {
        name: params.name,
        department: params.department,
        role: params.role,
        phone: params.phone
      })
  }),
  delete: router.mutation({
    mutationFn: (id: string) => client.collection(Collections.User).delete(id)
  })
});
