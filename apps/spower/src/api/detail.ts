import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import { DetailMaxResponse, DetailResponse, client } from '@storeo/core';

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

export const CreateDetailSchema = object().shape({
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) =>
      Number(originalValue.toString().replace(/,/g, '.'))
    )
    .typeError('Sai định dạng số')
});

export type CreateDetailInput = InferType<typeof CreateDetailSchema>;

export function useCreateDetail(
  documentId: string,
  parentId?: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createDetail'],
    mutationFn: async (params: CreateDetailInput) => {
      const parent = parentId ? parentId : `${documentId}-root`;

      let index = 0;
      try {
        const maxInfo = await client
          .collection<DetailMaxResponse>('detailMax')
          .getOne(parent);
        index = maxInfo.maxIndex as number;
      } catch (e) {
        /**/
      }

      return await client.collection('detail').create({
        ...params,
        document: documentId,
        parent,
        index: index + 1
      });
    },
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllDetailsKey(documentId)
        })
      ]);
    }
  });
}

export const UpdateDetailSchema = object().shape({
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number().typeError('Sai định dạng số')
});

export type UpdateDetailInput = InferType<typeof UpdateDetailSchema>;

export function useUpdateDetail(detailId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateDetail', detailId],
    mutationFn: (params: UpdateDetailInput) =>
      client.collection<DetailResponse>('detail').update(detailId, params),
    onSuccess: async record => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllDetailsKey(record.document)
        }),
        queryClient.invalidateQueries({
          queryKey: getDetailByIdKey(detailId)
        })
      ]);
    }
  });
}

export function useDeleteDetails(documentId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteDetail'],
    mutationFn: (detailIds: string[]) =>
      Promise.all(
        detailIds.map(documentId =>
          client.collection<DetailResponse>('detail').delete(documentId, {
            requestKey: null
          })
        )
      ),
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllDetailsKey(documentId)
        })
      ]);
    }
  });
}
