import { queryOptions, useQuery } from '@tanstack/react-query';

import { SupplierResponse, client } from '@storeo/core';

export function getAllSuppliersKey() {
  return ['getAllSuppliersKey'];
}

export function getAllSuppliers() {
  return queryOptions({
    queryKey: getAllSuppliersKey(),
    queryFn: () => client.collection<SupplierResponse>('supplier').getFullList()
  });
}

export function useGetAllSuppliers() {
  return useQuery(getAllSuppliers());
}
