import { queryOptions } from '@tanstack/react-query';
import PocketBase from 'pocketbase';

import { UsersResponse } from '@storeo/core';

import { EmployeeSearch } from '../../routes/_authenticated/general/employee';


function getEmployees(search: EmployeeSearch, pb?: PocketBase) {
  const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
  return pb
    ?.collection('test')
    .getList<UsersResponse>(search.pageIndex, search.pageSize, {
      filter
    });
}

export function employeesOptions(search: EmployeeSearch, pb?: PocketBase) {
  return queryOptions({
    queryKey: ['employees', search],
    queryFn: () => getEmployees(search, pb)
  });
}
