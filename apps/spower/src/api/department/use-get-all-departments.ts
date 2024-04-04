import { queryOptions, useQuery } from '@tanstack/react-query';

import { DepartmentResponse, client } from '@storeo/core';

export function getAllDepartmentsKey() {
  return ['getAllDepartmentsKey'];
}

export function getAllDepartments() {
  return queryOptions({
    queryKey: getAllDepartmentsKey(),
    queryFn: () =>
      client.collection<DepartmentResponse>('department').getFullList()
  });
}

export function useGetAllDepartments() {
  return useQuery(getAllDepartments());
}
