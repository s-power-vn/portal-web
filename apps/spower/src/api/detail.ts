import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

import { DetailRecord, DetailResponse, client } from '@storeo/core';

export function getAllDetailsByDocumentIdKey(documentId: string) {
  return ['getAllDetailsByDocumentIdKey', documentId];
}

export function getAllDetailsByDocumentId(documentId: string) {
  return queryOptions({
    queryKey: getAllDetailsByDocumentIdKey(documentId),
    queryFn: () => {
      return client.collection<DetailResponse>('detail').getFullList({
        filter: `document = "${documentId}"`,
        sort: '-created'
      });
    }
  });
}

export function useGetAllDetailsByDocumentId(documentId: string) {
  return useQuery(getAllDetailsByDocumentId(documentId));
}

export function getDetailByIdKey(detailId: string) {
  return ['getDetailByIdKey', detailId];
}

export function getDetailById(detailId: string) {
  return queryOptions({
    queryKey: getDetailByIdKey(detailId),
    queryFn: () => client.collection<DetailResponse>('detail').getOne(detailId)
  });
}

export function useGetDetailById(detailId: string) {
  return useQuery(getDetailById(detailId));
}

export function useCreateDetail(onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['createDetail'],
    mutationFn: (params: DetailRecord) =>
      client.collection('detail').create<DetailResponse>(params),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
}

export function useUpdateDetail(detailId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateDetail', detailId],
    mutationFn: (params: DetailRecord) =>
      client.collection('detail').update(detailId, params),
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getDetailByIdKey(detailId)
        })
      ]);
    }
  });
}

export function useDeleteDetail(detailId: string, onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['deleteDetail', detailId],
    mutationFn: () => client.collection('detail').delete(detailId),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
}
