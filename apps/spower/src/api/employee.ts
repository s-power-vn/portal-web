import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import {
  DepartmentResponse,
  UserRecord,
  UserResponse,
  client
} from '@storeo/core';

export type UserData = UserResponse & {
  expand: {
    department: DepartmentResponse;
  };
};

export const employeeApi = router('employee', {
  listFull: router.query({
    fetcher: () =>
      client.collection<UserData>('user').getFullList({
        expand: 'department'
      })
  }),
  list: router.query({
    fetcher: (search?: EmployeesSearch) => {
      const filter = `(name ~ "${search?.filter ?? ''}" || email ~ "${search?.filter ?? ''}")`;
      return client
        .collection<UserData>('user')
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created',
          expand: 'department'
        });
    }
  }),
  byId: router.query({
    fetcher: (id: string) =>
      client.collection<UserData>('user').getOne(id, {
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
      client.collection('user').update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) => client.collection('user').delete(id)
  })
});

export const EmployeesSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type EmployeesSearch = InferType<typeof EmployeesSearchSchema>;
