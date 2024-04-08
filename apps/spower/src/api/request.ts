import {queryOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {
  client,
  DetailResponse,
  RequestDetailResponse,
  RequestDetailSupplierRecord,
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

export type RequestDetailSupplierData = RequestDetailSupplierResponse & {
  expand: {
    supplier: SupplierResponse;
    requestDetail: RequestDetailResponse & {
      expand: {
        detail: DetailResponse;
      };
    };
  }
}

export function getAllRequestsKey(documentId: string) {
  return ['getAllRequestsKey', documentId];
}

export function getAllRequests(documentId: string) {
  return queryOptions({
    queryKey: getAllRequestsKey(documentId),
    queryFn: () =>
      client.collection<RequestResponse>('request').getFullList({
        filter: `document = "${documentId}"`,
        sort: '-created'
      })
  });
}

export function useGetAllRequests(documentId: string) {
  return useQuery(getAllRequests(documentId));
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
          hasChild?: boolean;
        }[];
      }
    ) => Promise.all([
      ...params.details.filter(detail => !detail.hasChild).map(detail =>
        client.collection('requestDetail').update(<string>detail.id, {
          volume: detail.requestVolume
        })
      ),
      client.collection('request').update(requestId, params)
    ]),
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

export function getAllRequestDetailSuppliersKey(requestDetailId: string) {
  return ['getAllRequestDetailSuppliersKey', requestDetailId];
}

export function getAllRequestDetailSuppliers(requestDetailId: string) {
  return queryOptions({
    queryKey: getAllRequestDetailSuppliersKey(requestDetailId),
    queryFn: () =>
      client
        .collection<RequestDetailSupplierData>(
          'requestDetailSupplier'
        )
        .getFullList({
          filter: `requestDetail = "${requestDetailId}"`,
          expand: 'supplier,requestDetail.detail'
        })
  });
}

export function useGetAllRequestDetailSuppliers(requestDetailId: string, enabled?: boolean) {
  return useQuery({
    ...getAllRequestDetailSuppliers(requestDetailId),
    enabled
  });
}

export function useCreateRequestDetailSupplier(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createRequestDetailSupplier'],
    mutationFn: (params: RequestDetailSupplierRecord) =>
      client
        .collection('requestDetailSupplier')
        .create(params),
    onSuccess: async (_, variables) => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllRequestDetailSuppliersKey(variables.requestDetail ?? '')
        })
      ]);
    }
  });
}

export function useUpdateRequestDetailSupplier(
  requestDetailSupplierId: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateRequestDetailSupplier', requestDetailSupplierId],
    mutationFn: (params: RequestDetailSupplierRecord) =>
      client
        .collection('requestDetailSupplier')
        .update(requestDetailSupplierId, params),
    onSuccess: async (_, variables) => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllRequestDetailSuppliersKey(variables.requestDetail ?? '')
        })
      ]);
    }
  });
}

export function useDeleteRequestDetailSupplier(
  onSuccess?: () => void
) {
  return useMutation({
    mutationKey: ['deleteRequestDetailSupplier'],
    mutationFn: (requestDetailSupplierId: string) =>
      client
        .collection('requestDetailSupplier')
        .delete(requestDetailSupplierId),
    onSuccess: () => {
      onSuccess?.();
    }
  });
}
