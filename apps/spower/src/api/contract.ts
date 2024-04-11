import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import {
  Collections,
  ContractRecord,
  ContractResponse,
  SupplierResponse,
  client
} from '@storeo/core';

export type ContractData = ContractResponse & {
  expand: {
    supplier: SupplierResponse;
  };
};

export const ContractsSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

type ContractsSearch = InferType<typeof ContractsSearchSchema>;

export function getAllContractsKey() {
  return ['getAllContractsKey'];
}

export function getAllContracts() {
  return queryOptions({
    queryKey: getAllContractsKey(),
    queryFn: () =>
      client.collection<ContractResponse>(Collections.Contract).getFullList()
  });
}

export function useGetAllContracts() {
  return useQuery(getAllContracts());
}

export function getContractsKey(search: ContractsSearch) {
  return ['getContracts', search];
}

export function getContracts(search: ContractsSearch) {
  return queryOptions({
    queryKey: getContractsKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search.filter ?? ''}" || email ~ "${search.filter ?? ''}")`;
      return client
        .collection<ContractResponse>(Collections.Contract)
        .getList(search.pageIndex, search.pageSize, {
          filter,
          sort: '-created'
        });
    }
  });
}

export function useGetContracts(search: ContractsSearch) {
  return useQuery(getContracts(search));
}

export function getContractByIdKey(contractId: string) {
  return ['getContractByIdKey', contractId];
}

export function getContractById(contractId: string) {
  return queryOptions({
    queryKey: getContractByIdKey(contractId),
    queryFn: () =>
      client
        .collection<ContractResponse>(Collections.Contract)
        .getOne(contractId)
  });
}

export function useGetContractById(contractId: string) {
  return useQuery(getContractById(contractId));
}

export function useCreateContract(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createContract'],
    mutationFn: (params: ContractRecord) =>
      client.collection(Collections.Contract).create(params),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({ queryKey: getAllContractsKey() });
    }
  });
}

export function useUpdateContract(contractId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateContract', contractId],
    mutationFn: (params: ContractRecord) =>
      client.collection(Collections.Contract).update(contractId, params),
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getContractByIdKey(contractId)
        }),
        await queryClient.invalidateQueries({
          queryKey: getAllContractsKey()
        })
      ]);
    }
  });
}

export function useDeleteContract(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteContract'],
    mutationFn: (contractId: string) =>
      client.collection(Collections.Contract).delete(contractId),
    onSuccess: async () => {
      onSuccess?.();
      await queryClient.invalidateQueries({
        queryKey: getAllContractsKey()
      });
    }
  });
}
