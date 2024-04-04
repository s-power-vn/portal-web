import { queryOptions, useQuery } from '@tanstack/react-query';

import { DepartmentResponse, client } from '@storeo/core';

const collectionName = 'department';

export function getAllDepartmentsKey() {
  return ['getAllDepartmentsKey'];
}

export function getAllDepartments() {
  return queryOptions({
    queryKey: getAllDepartmentsKey(),
    queryFn: () =>
      client.collection<DepartmentResponse>(collectionName).getFullList()
  });
}

export function useGetAllDepartments() {
  return useQuery(getAllDepartments());
}
