import {queryOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {
  client,
  DetailResponse,
  RequestDetailResponse,
  RequestDetailSupplierResponse,
  RequestRecord,
  RequestResponse,
  SupplierResponse
} from '@storeo/core';

export type RequestData = RequestResponse & {
  expand: {
    requestDetail_via_request: (RequestDetailResponse & {
      expand: {
        detail: DetailResponse;
        requestDetailSupplier_via_requestDetail: (RequestDetailSupplierResponse & {
          expand: {
            supplier: SupplierResponse;
          };
        })[];
      };
    })[];
  };
};

export function getAllRequestsByDocumentIdKey(documentId: string) {
  return ['getAllRequestsByDocumentIdKey', documentId];
}

export function getAllRequestsByDocumentId(documentId: string) {
  return queryOptions({
    queryKey: getAllRequestsByDocumentIdKey(documentId),
    queryFn: () =>
      client.collection<RequestResponse>('request').getFullList({
        filter: `document = "${documentId}"`,
        sort: '-created'
      })
  });
}

export function useGetAllRequests(documentId: string) {
  return useQuery(getAllRequestsByDocumentId(documentId));
}

export function getRequestByIdKey(requestId: string) {
  return ['getRequestByIdKey', requestId];
}

export function getRequestById(requestId: string) {
  return queryOptions({
    queryKey: getRequestByIdKey(requestId),
    queryFn: () =>
      client.collection<RequestData>('request').getOne(requestId, {
        expand:
          'requestDetail_via_request.detail,' +
          'requestDetail_via_request.requestDetailSupplier_via_requestDetail.supplier'
      })
  });
}

export function useGetRequestById(requestId: string) {
  return useQuery(getRequestById(requestId));
}

export function useCreateRequest(onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['createRequest'],
    mutationFn: (params: RequestRecord) =>
      client.collection('request').create(params),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
}

export function useUpdateRequest(requestId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateRequest', requestId],
    mutationFn: (
      params: RequestRecord & {
        details: {
          id?: string;
          requestVolume?: number;
        }[];
      }
    ) => {
      return Promise.all([
        ...params.details.map(detail =>
          client.collection('requestDetail').update(<string>detail.id, {
            volume: detail.requestVolume
          })
        ),
        client.collection('request').update(requestId, params)
      ]);
    },
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getRequestByIdKey(requestId)
        })
      ]);
    }
  });
}

export function useDeleteRequest(onSuccess?: () => void) {
  return useMutation({
    mutationKey: ['deleteRequest'],
    mutationFn: (requestId: string) =>
      client.collection('request').delete(requestId),
    onSuccess: async () => {
      onSuccess?.();
    }
  });
}
