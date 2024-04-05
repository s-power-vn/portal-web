import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

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

export const EmployeesSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type EmployeesSearch = InferType<typeof EmployeesSearchSchema>;

export function getAllEmployeesKey() {
  return ['getAllEmployeesKey'];
}

export function getAllEmployees() {
  return queryOptions({
    queryKey: getAllEmployeesKey(),
    queryFn: () =>
      client.collection<UserData>('user').getFullList({
        expand: 'department'
      })
  });
}

export function useGetAllEmployees() {
  return useQuery(getAllEmployees());
}

export function getEmployeesKey(search: EmployeesSearch) {
  return ['getEmployees', search];
}

export function getEmployees(search: EmployeesSearch) {
  return queryOptions({
    queryKey: getEmployeesKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
      return client
        .collection<UserData>('user')
        .getList(search.pageIndex, search.pageSize, {
          filter,
          sort: '-created',
          expand: 'department'
        });
    }
  });
}

export function useGetEmployees(search: EmployeesSearch) {
  return useQuery(getEmployees(search));
}

export function getEmployeeByIdKey(employeeId: string) {
  return ['getEmployeeByIdKey', employeeId];
}

export function getEmployeeById(employeeId: string) {
  return queryOptions({
    queryKey: getEmployeeByIdKey(employeeId),
    queryFn: () =>
      client.collection<UserData>('user').getOne(employeeId, {
        expand: 'department'
      })
  });
}

export function useGetEmployeeById(employeeId: string) {
  return useQuery(getEmployeeById(employeeId));
}

export function useCreateEmployee(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createEmployee'],
    mutationFn: (params: UserRecord) =>
      client.collection('user').create<UserResponse>(params),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({ queryKey: getAllEmployeesKey() });
    }
  });
}

export function useUpdateEmployee(employeeId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateEmployee', employeeId],
    mutationFn: (params: UserRecord) =>
      client.collection('user').update(employeeId, params),
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getEmployeeByIdKey(employeeId)
        }),
        queryClient.invalidateQueries({
          queryKey: getAllEmployeesKey()
        })
      ]);
    }
  });
}

export function useDeleteEmployee(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteEmployee'],
    mutationFn: (employeeId: string) =>
      client.collection('user').delete(employeeId),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({
        queryKey: getAllEmployeesKey()
      });
    }
  });
}
