import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import { UserRecord, UserResponse, client } from '@storeo/core';

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
    queryFn: () => client.collection<UserResponse>('user').getFullList()
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
        .collection<UserResponse>('user')
        .getList(search.pageIndex, search.pageSize, {
          filter,
          sort: '-created'
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
    queryFn: () => client.collection<UserResponse>('user').getOne(employeeId)
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
      await queryClient.invalidateQueries({
        queryKey: getAllEmployeesKey()
      });
    }
  });
}

export function useDeleteEmployee(employeeId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteEmployee', employeeId],
    mutationFn: () => client.collection('user').delete(employeeId),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({
        queryKey: getAllEmployeesKey()
      });
    }
  });
}
