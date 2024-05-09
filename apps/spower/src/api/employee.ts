import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import {
  Collections,
  DepartmentResponse,
  UserRecord,
  UserResponse,
  client
} from '@storeo/core';

export const EmployeesSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type EmployeesSearch = InferType<typeof EmployeesSearchSchema>;

export type UserData = UserResponse & {
  expand: {
    department: DepartmentResponse;
  };
};

export const employeeApi = router('employee', {
  listFull: router.query({
    fetcher: () =>
      client.collection<UserData>(Collections.User).getFullList({
        sort: '-created',
        expand: 'department'
      })
  }),
  list: router.query({
    fetcher: (search?: EmployeesSearch) => {
      const filter = `(name ~ "${search?.filter ?? ''}" || email ~ "${search?.filter ?? ''}")`;
      return client
        .collection<UserData>(Collections.User)
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created',
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
      client.collection(Collections.User).update(params.id, params)
  }),
  delete: router.mutation({
    mutationFn: (id: string) => client.collection(Collections.User).delete(id)
  })
});
