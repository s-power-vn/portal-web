import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

import {
  Collections,
  ContractItemFileResponse,
  ContractItemResponse,
  ContractResponse,
  SupplierResponse,
  client
} from '@storeo/core';

import { getRequestByIdKey } from './request';

export type ContractItemData = ContractItemResponse & {
  expand: {
    contractItemFile_via_contractItem: ContractItemFileResponse[];
  };
};

export type ContractData = ContractResponse & {
  expand: {
    supplier: SupplierResponse;
    contractItem_via_contract: ContractItemResponse[];
  };
};

export function useUpdateContract(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateContract'],
    mutationFn: (params: {
      contractId: string;
      count?: number;
      note?: string;
    }) => {
      const { contractId, ...rest } = params;
      return client.collection(Collections.Contract).update(contractId, rest);
    },
    onSuccess: async data => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getRequestByIdKey(data.request)
        })
      ]);
    }
  });
}

export function getContractItemByIdKey(contractItemId: string) {
  return ['contractItem', contractItemId];
}

export function getContractItemById(contractItemId: string) {
  return queryOptions({
    queryKey: getContractItemByIdKey(contractItemId),
    queryFn: () =>
      client
        .collection<ContractItemData>(Collections.ContractItem)
        .getOne(contractItemId, {
          expand: 'contractItemFile_via_contractItem'
        })
  });
}

export function useGetContractItemById(contractItemId: string) {
  return useQuery(getContractItemById(contractItemId));
}
