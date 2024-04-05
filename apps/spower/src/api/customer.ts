import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import { CustomerRecord, CustomerResponse, client } from '@storeo/core';

export const CustomersSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type CustomersSearch = InferType<typeof CustomersSearchSchema>;

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

export function getCustomersKey(search: CustomersSearch) {
  return ['getCustomers', search];
}

export function getCustomers(search: CustomersSearch) {
  return queryOptions({
    queryKey: getCustomersKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
      return client
        .collection<CustomerResponse>('customer')
        .getList(search.pageIndex, search.pageSize, {
          filter,
          sort: '-created'
        });
    }
  });
}

export function useGetCustomers(search: CustomersSearch) {
  return useQuery(getCustomers(search));
}

export function getCustomerByIdKey(customerId: string) {
  return ['getCustomerByIdKey', customerId];
}

export function getCustomerById(customerId: string) {
  return queryOptions({
    queryKey: getCustomerByIdKey(customerId),
    queryFn: () =>
      client.collection<CustomerResponse>('customer').getOne(customerId)
  });
}

export function useGetCustomerById(customerId: string) {
  return useQuery(getCustomerById(customerId));
}

export function useCreateCustomer(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createCustomer'],
    mutationFn: (params: CustomerRecord) =>
      client.collection('customer').create<CustomerResponse>(params),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({ queryKey: getAllCustomersKey() });
    }
  });
}

export function useUpdateCustomer(customerId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateCustomer', customerId],
    mutationFn: (params: CustomerRecord) =>
      client.collection('customer').update(customerId, params),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({
        queryKey: getAllCustomersKey()
      });
    }
  });
}

export function useDeleteCustomer(customerId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteCustomer', customerId],
    mutationFn: () => client.collection('customer').delete(customerId),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({
        queryKey: getAllCustomersKey()
      });
    }
  });
}
