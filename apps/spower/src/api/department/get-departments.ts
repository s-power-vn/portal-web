import { queryOptions } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { DepartmentResponse } from '@storeo/core';

function getDepartments(pb?: PocketBase) {
  return pb?.collection('department').getFullList<DepartmentResponse>();
}

export function departmentsOptions(pb?: PocketBase) {
  return queryOptions({
    queryKey: ['departments'],
    queryFn: () => getDepartments(pb)
  });
}
