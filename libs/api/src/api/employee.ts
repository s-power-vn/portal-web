import type { DepartmentResponse, UserRecord, UserResponse } from 'portal-core';
import { Collections, client } from 'portal-core';

import { router } from 'react-query-kit';

import type { Search } from './types';

export type UserData = UserResponse & {
  expand: {
    department: DepartmentResponse;
  };
};

export const employeeApi = router('employee', {
  listFull: router.query({
    fetcher: (search?: string) => {
      return client.collection<UserData>(Collections.User).getFullList({
        filter: `name ~ "${search ?? ''}" || email ~ "${search ?? ''}"`,
        sort: 'department',
        expand: 'department'
      });
    }
  }),
  listFirst: router.query({
    fetcher: (search?: string) =>
      client.collection<UserData>(Collections.User).getList(1, 10, {
        filter: `name ~ "${search ?? ''}" || email ~ "${search ?? ''}"`,
        sort: 'department',
        expand: 'department'
      })
  }),
  listByCondition: router.query({
    fetcher: ({
      filter,
      pageIndex,
      pageSize
    }: {
      filter?: string;
      pageIndex?: number;
      pageSize?: number;
    }) =>
      client
        .collection<UserData>(Collections.User)
        .getList(pageIndex ?? 1, pageSize ?? 10, {
          filter: filter ?? '',
          sort: 'department',
          expand: 'department'
        })
  }),
  list: router.query({
    fetcher: (search?: Search) => {
      const filter = `(name ~ "${search?.filter ?? ''}" || email ~ "${search?.filter ?? ''}")`;
      return client
        .collection<UserData>(Collections.User)
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: 'department',
          expand: 'department'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<UserData>(Collections.User).getOne(id, {
        expand: 'department'
      })
  }),
  create: router.mutation({
    mutationFn: (params: UserRecord & { password: string }) =>
      client.send('/create-employee', {
        method: 'POST',
        body: params
      })
  }),
  update: router.mutation({
    mutationFn: (params: UserRecord & { id: string }) =>
      client.collection(Collections.User).update(params.id, {
        name: params.name,
        department: params.department,
        role: params.role,
        title: params.title,
        phone: params.phone
      })
  }),
  delete: router.mutation({
    mutationFn: (id: string) => client.collection(Collections.User).delete(id)
  })
});
