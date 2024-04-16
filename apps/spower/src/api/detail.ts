import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import { DetailInfoResponse, DetailResponse, client } from '@storeo/core';

export function getAllDetailsKey(projectId: string) {
  return ['getAllDetailsKey', projectId];
}

export function getAllDetails(projectId: string) {
  return queryOptions({
    queryKey: getAllDetailsKey(projectId),
    queryFn: () => {
      return client.collection<DetailResponse>('detail').getFullList({
        filter: `project = "${projectId}"`,
        sort: '-created'
      });
    }
  });
}

export function useGetAllDetails(projectId: string) {
  return useQuery(getAllDetails(projectId));
}

export function getAllDetailInfosKey(projectId: string) {
  return ['getAllDetailInfosKey', projectId];
}

export function getAllDetailInfos(projectId: string) {
  return queryOptions({
    queryKey: getAllDetailInfosKey(projectId),
    queryFn: () => {
      return client.collection<DetailInfoResponse>('detailInfo').getFullList({
        filter: `project = "${projectId}"`,
        sort: '-created'
      });
    }
  });
}

export function useGetAllDetailInfos(projectId: string) {
  return useQuery(getAllDetailInfos(projectId));
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
  level: string().required('Hãy nhập ID'),
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) =>
      Number(originalValue.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .typeError('Sai định dạng số')
});

export type CreateDetailInput = InferType<typeof CreateDetailSchema>;

export function useCreateDetail(
  projectId: string,
  parentId?: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createDetail'],
    mutationFn: async (params: CreateDetailInput) => {
      const parent = parentId ? parentId : `${projectId}-root`;
      return await client.collection('detail').create({
        ...params,
        project: projectId,
        parent
      });
    },
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllDetailsKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: getAllDetailInfosKey(projectId)
        })
      ]);
    }
  });
}

export const UpdateDetailSchema = object().shape({
  level: string().required('Hãy nhập ID'),
  title: string().required('Hãy nhập mô tả công việc'),
  volume: number()
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .typeError('Sai định dạng số'),
  unit: string(),
  unitPrice: number()
    .transform((_, originalValue) =>
      Number(originalValue.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable()
    .typeError('Sai định dạng số')
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
          queryKey: getAllDetailsKey(record.project)
        }),
        queryClient.invalidateQueries({
          queryKey: getAllDetailInfosKey(record.project)
        }),
        queryClient.invalidateQueries({
          queryKey: getDetailByIdKey(detailId)
        })
      ]);
    }
  });
}

export function useDeleteDetails(projectId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteDetail'],
    mutationFn: (detailIds: string[]) =>
      Promise.all(
        detailIds.map(projectId =>
          client.collection<DetailResponse>('detail').delete(projectId, {
            requestKey: null
          })
        )
      ),
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllDetailsKey(projectId)
        }),
        queryClient.invalidateQueries({
          queryKey: getAllDetailInfosKey(projectId)
        })
      ]);
    }
  });
}
