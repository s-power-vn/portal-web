import { queryOptions } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import PocketBase from 'pocketbase';

import { UsersResponse } from '@storeo/core';

function getEmployees(pb?: PocketBase, pagination?: PaginationState) {
  return pb
    ?.collection('test')
    .getList<UsersResponse>(
      (pagination?.pageIndex ?? 0) + 1,
      pagination?.pageSize
    );
}

export function employeesOptions(
  pb?: PocketBase,
  pagination?: PaginationState
) {
  const page = pagination ?? {
    pageIndex: 0,
    pageSize: 10
  };

  return queryOptions({
    queryKey: ['employees', page],
    queryFn: () => getEmployees(pb, page)
  });
}
