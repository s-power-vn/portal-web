import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import { SupplierRecord, SupplierResponse, client } from '@storeo/core';

export const SuppliersSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type SuppliersSearch = InferType<typeof SuppliersSearchSchema>;

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

export function getSuppliersKey(search: SuppliersSearch) {
  return ['getSuppliers', search];
}

export function getSuppliers(search: SuppliersSearch) {
  return queryOptions({
    queryKey: getSuppliersKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
      return client
        .collection<SupplierResponse>('supplier')
        .getList(search.pageIndex, search.pageSize, {
          filter,
          sort: '-created'
        });
    }
  });
}

export function useGetSuppliers(search: SuppliersSearch) {
  return useQuery(getSuppliers(search));
}

export function getSupplierByIdKey(supplierId: string) {
  return ['getSupplierByIdKey', supplierId];
}

export function getSupplierById(supplierId: string) {
  return queryOptions({
    queryKey: getSupplierByIdKey(supplierId),
    queryFn: () =>
      client.collection<SupplierResponse>('supplier').getOne(supplierId)
  });
}

export function useGetSupplierById(supplierId: string) {
  return useQuery(getSupplierById(supplierId));
}

export function useCreateSupplier(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createSupplier'],
    mutationFn: (params: SupplierRecord) =>
      client.collection('supplier').create<SupplierResponse>(params),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({ queryKey: getAllSuppliersKey() });
    }
  });
}

export function useUpdateSupplier(supplierId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateSupplier', supplierId],
    mutationFn: (params: SupplierRecord) =>
      client.collection('supplier').update(supplierId, params),
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getSupplierByIdKey(supplierId)
        }),
        queryClient.invalidateQueries({
          queryKey: getAllSuppliersKey()
        })
      ]);
    }
  });
}

export function useDeleteSupplier(supplierId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteSupplier', supplierId],
    mutationFn: () => client.collection('supplier').delete(supplierId),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({
        queryKey: getAllSuppliersKey()
      });
    }
  });
}
