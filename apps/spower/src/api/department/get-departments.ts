import { queryOptions } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { DepartmentsResponse } from '@storeo/core';

function getDepartments(pb?: PocketBase) {
  return pb?.collection('departments').getFullList<DepartmentsResponse>();
}

export function departmentsOptions(pb?: PocketBase) {
  return queryOptions({
    queryKey: ['departments'],
    queryFn: () => getDepartments(pb)
  });
}
