import { queryOptions, useQuery } from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import { DocumentResponse, client } from '@storeo/core';

export const DocumentSearchSchema = object().shape({
  pageIndex: number().optional().default(1),
  pageSize: number().optional().default(10),
  filter: string().optional().default('')
});

export type DocumentSearch = InferType<typeof DocumentSearchSchema>;

export function getWaitingDocumentsKey(search?: DocumentSearch) {
  return ['getWaitingDocumentsKey', search];
}

export function getWaitingDocuments(search?: DocumentSearch) {
  return queryOptions({
    queryKey: getWaitingDocumentsKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search?.filter ?? ''}" || bidding ~ "${search?.filter ?? ''}")`;
      return client
        ?.collection<DocumentResponse>('document')
        .getList(search?.pageIndex, search?.pageSize, {
          filter:
            filter +
            `&& (assignee = "${client?.authStore.model?.id}") && (status = "ToDo")`,
          sort: '-created',
          expand: 'customer,assignee,createdBy'
        });
    }
  });
}

export function useGetWaitingDocuments(search?: DocumentSearch) {
  return useQuery(getWaitingDocuments(search));
}

export function getMineDocumentsKey(search?: DocumentSearch) {
  return ['getMineDocumentsKey', search];
}

export function getMineDocuments(search?: DocumentSearch) {
  return queryOptions({
    queryKey: getMineDocumentsKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search?.filter ?? ''}" || bidding ~ "${search?.filter ?? ''}")`;
      return client
        .collection<DocumentResponse>('document')
        .getList(search?.pageIndex, search?.pageSize, {
          filter: filter + `&& (createdBy = "${client.authStore.model?.id}")`,
          sort: '-created',
          expand: 'customer,assignee,createdBy'
        });
    }
  });
}

export function useGetMineDocuments(search?: DocumentSearch) {
  return useQuery(getMineDocuments(search));
}

export function getAllDocumentsKey(search?: DocumentSearch) {
  return ['getAllDocumentsKey', search];
}

export function getAllDocuments(search?: DocumentSearch) {
  return queryOptions({
    queryKey: getAllDocumentsKey(search),
    queryFn: () => {
      const filter = `(name ~ "${search?.filter ?? ''}" || bidding ~ "${search?.filter ?? ''}")`;
      return client
        .collection<DocumentResponse>('document')
        .getList(search?.pageIndex, search?.pageSize, {
          filter,
          sort: '-created',
          expand: 'customer,assignee,createdBy'
        });
    }
  });
}

export function useGetAllDocuments(search?: DocumentSearch) {
  return useQuery(getAllDocuments(search));
}
