import { queryOptions } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { UsersResponse } from '@storeo/core';


export function employeesOptions(pb?: PocketBase) {
  return queryOptions({
    queryKey: ['posts'],
    queryFn: () => getEmployees(pb)
  });
}

export function getEmployees(pb?: PocketBase) {
  return pb?.collection('users').getFullList<UsersResponse>();
}
