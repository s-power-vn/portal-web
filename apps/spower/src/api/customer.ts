import { queryOptions, useQuery } from '@tanstack/react-query';

import { CustomerResponse, client } from '@storeo/core';

export function getAllCustomersKey() {
  return ['getAllCustomersKey'];
}

export function getAllCustomers() {
  return queryOptions({
    queryKey: getAllCustomersKey(),
    queryFn: () => client.collection<CustomerResponse>('customer').getFullList()
  });
}

export function useGetAllCustomers() {
  return useQuery(getAllCustomers());
}
