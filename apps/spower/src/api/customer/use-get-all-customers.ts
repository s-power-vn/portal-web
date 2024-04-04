import { queryOptions, useQuery } from '@tanstack/react-query';

import { CustomerResponse, client } from '@storeo/core';

const collectionName = 'customer';

export function getAllCustomersKey() {
  return ['getAllCustomersKey'];
}

export function getAllCustomers() {
  return queryOptions({
    queryKey: getAllCustomersKey(),
    queryFn: () =>
      client.collection<CustomerResponse>(collectionName).getFullList()
  });
}

export function useGetAllCustomers() {
  return useQuery(getAllCustomers());
}
