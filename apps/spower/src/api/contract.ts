import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Collections, client } from '@storeo/core';

import { getRequestByIdKey } from './request';

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
