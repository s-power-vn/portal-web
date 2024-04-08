import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { InferType, number, object, string } from 'yup';

import {
  CustomerResponse,
  DocumentResponse,
  DocumentStatusOptions,
  UserResponse,
  client
} from '@storeo/core';

export type DocumentData = DocumentResponse & {
  expand: {
    customer: CustomerResponse;
    assignee: UserResponse;
    createdBy: UserResponse;
  };
};

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
        ?.collection<DocumentData>('document')
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
        .collection<DocumentData>('document')
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
        .collection<DocumentData>('document')
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

export function getDocumentByIdKey(documentId: string) {
  return ['getDocumentByIdKey', documentId];
}

export function getDocumentById(documentId: string) {
  return queryOptions({
    queryKey: getDocumentByIdKey(documentId),
    queryFn: () => {
      return client.collection<DocumentData>('document').getOne(documentId, {
        expand: 'customer,assignee,createdBy'
      });
    }
  });
}

export function useGetDocumentById(documentId: string) {
  return useQuery(getDocumentById(documentId));
}

export const CreateDocumentSchema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

export type CreateDocumentInput = InferType<typeof CreateDocumentSchema>;

export function useCreateDocument(onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['createDocument'],
    mutationFn: (params: CreateDocumentInput) =>
      client.collection('document').create<DocumentResponse>({
        ...params,
        status: DocumentStatusOptions.ToDo,
        createdBy: client.authStore.model?.id
      }),
    onSuccess
  });
}

export const UpdateDocumentSchema = object().shape({
  name: string().required('Hãy nhập tên công trình'),
  bidding: string().required('Hãy nhập tên gói thầu'),
  customer: string().required('Hãy chọn chủ đầu tư')
});

export type UpdateDocumentInput = InferType<typeof UpdateDocumentSchema>;

export function useUpdateDocument(documentId: string, onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['updateDocument', documentId],
    mutationFn: (params: UpdateDocumentInput) =>
      client.collection('document').update(documentId, params),
    onSuccess
  });
}
