import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

import {
  DetailMaxResponse,
  DetailRecord,
  DetailResponse,
  client
} from '@storeo/core';

export type DetailData = DetailResponse & {
  children?: DetailData[];
  level?: string;
  hasChild?: boolean;
  requestVolume?: number;
};

export function getAllDetailsKey(documentId: string) {
  return ['getAllDetailsKey', documentId];
}

export function getAllDetails(documentId: string) {
  return queryOptions({
    queryKey: getAllDetailsKey(documentId),
    queryFn: () => {
      return client.collection<DetailResponse>('detail').getFullList({
        filter: `document = "${documentId}"`,
        sort: '-created'
      });
    }
  });
}

export function useGetAllDetails(documentId: string) {
  return useQuery(getAllDetails(documentId));
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
    mutationFn: async (params: DetailRecord) => {
      const maxInfo = await client
        .collection<DetailMaxResponse>('detailMax')
        .getOne(params.parent ? params.parent : 'root');
      return await client.collection('detail').create({
        ...params,
        index: (maxInfo.maxIndex as number) + 1
      });
    },
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

export function useDeleteDetails(onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['deleteDetail'],
    mutationFn: (documentDetailIds: string[]) =>
      Promise.all(
        documentDetailIds.map(documentId =>
          client.collection<DetailResponse>('detail').delete(documentId, {
            requestKey: null
          })
        )
      ),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
}
