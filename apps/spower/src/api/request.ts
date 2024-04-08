import {queryOptions, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {
  client,
  DetailResponse,
  RequestDetailResponse,
  RequestDetailSupplierResponse,
  RequestResponse,
  SupplierResponse
} from '@storeo/core';
import {array, boolean, InferType, number, object, string} from "yup";

export type RequestDetailSupplierData = RequestDetailSupplierResponse & {
  expand: {
    supplier: SupplierResponse;
    requestDetail: RequestDetailData;
  }
}

export type RequestDetailData = RequestDetailResponse & {
  expand: {
    detail: DetailResponse;
    requestDetailSupplier_via_requestDetail: RequestDetailSupplierData[];
  },
  supplier?: string,
  supplierUnitPrice?: number,
  supplierName?: string,
}

export type RequestData = RequestResponse & {
  expand: {
    requestDetail_via_request: RequestDetailData[];
  }
};


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

export const CreateRequestSchema = object().shape({
  name: string().required('Hãy nhập nội dung'),
  details: array()
    .of(
      object().shape({
        id: string().optional(),
        hasChild: boolean().optional(),
        requestVolume: number()
          .transform((_, originalValue) =>
            Number(originalValue?.toString().replace(/,/g, '.'))
          )
          .typeError('Hãy nhập khối lượng yêu cầu')
          .when('hasChild', (hasChild, schema) => {
            console.log(hasChild);
            return hasChild[0]
              ? schema
              : schema
                .moreThan(0, 'Hãy nhập khối lượng yêu cầu')
                .required('Hãy nhập khối lượng yêu cầu');
          })
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
    .required('Hãy chọn ít nhất 1 hạng mục')
});

export type CreateRequestInput = InferType<typeof CreateRequestSchema>;

export function useCreateRequest(documentId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createRequest'],
    mutationFn: async (params: CreateRequestInput) => {
      const record = await client.collection('request').create({
        document: documentId,
        name: params.name
      });

      return await Promise.all(
        params.details.map(it => {
          return client.collection('requestDetail').create(
            {
              request: record.id,
              detail: it.id,
              volume: it.requestVolume
            },
            {
              requestKey: null
            }
          );
        })
      );
    },
    onSuccess: async () => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllRequestsKey(documentId)
        }),
      ])
    }
  });
}

export const UpdateRequestSchema = object().shape({
  name: string().required('Hãy nhập nội dung'),
  details: array()
    .of(
      object().shape({
        id: string().optional(),
        hasChild: boolean().optional(),
        requestVolume: number()
          .transform((_, originalValue) =>
            Number(originalValue?.toString().replace(/,/g, '.'))
          )
          .typeError('Hãy nhập khối lượng yêu cầu')
          .when('hasChild', (hasChild, schema) => {
            return hasChild[0]
              ? schema
              : schema
                .moreThan(0, 'Hãy nhập khối lượng yêu cầu')
                .required('Hãy nhập khối lượng yêu cầu');
          })
      })
    )
    .min(1, 'Hãy chọn ít nhất 1 hạng mục')
    .required('Hãy chọn ít nhất 1 hạng mục')
});

export type UpdateRequestInput = InferType<typeof UpdateRequestSchema>;

export function useUpdateRequest(requestId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateRequest', requestId],
    mutationFn: (
      params: UpdateRequestInput
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

export function getRequestDetailSupplierByIdKey(requestDetailSupplierId: string) {
  return ['getRequestDetailSupplierByIdKey', requestDetailSupplierId];
}

export function getRequestDetailSupplierById(requestDetailSupplierId: string) {
  return queryOptions({
    queryKey: getRequestDetailSupplierByIdKey(requestDetailSupplierId),
    queryFn: () =>
      client
        .collection<RequestDetailSupplierData>(
          'requestDetailSupplier'
        )
        .getOne(requestDetailSupplierId, {
          expand: 'supplier,requestDetail.detail'
        })
  });
}

export function useGetRequestDetailSupplierById(requestDetailSupplierId: string) {
  return useQuery(getRequestDetailSupplierById(requestDetailSupplierId));
}

export const CreateRequestDetailSupplierSchema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number().required('Hãy nhập đơn giá nhà cung cấp'),
  volume: number().required('Hãy nhập khối lượng nhà cung cấp')
});

export type CreateRequestDetailSupplierInput = InferType<
  typeof CreateRequestDetailSupplierSchema
>;

export function useCreateRequestDetailSupplier(reqestDetailId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createRequestDetailSupplier'],
    mutationFn: (params: CreateRequestDetailSupplierInput) =>
      client
        .collection<RequestDetailSupplierData>('requestDetailSupplier')
        .create({
          ...params,
          requestDetail: reqestDetailId
        }, {
          expand: 'supplier,requestDetail.detail'
        }),
    onSuccess: async (record) => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllRequestDetailSuppliersKey(record.requestDetail),
        }),
        queryClient.invalidateQueries({
          queryKey: getRequestByIdKey(
            record.expand.requestDetail.request
          )
        })
      ]);
    }
  });
}

export const UpdateRequestDetailSupplierSchema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number().required('Hãy nhập đơn giá nhà cung cấp'),
  volume: number().required('Hãy nhập khối lượng nhà cung cấp')
});

export type UpdateRequestDetailSupplierInput = InferType<
  typeof UpdateRequestDetailSupplierSchema
>;

export function useUpdateRequestDetailSupplier(
  requestDetailSupplierId: string,
  onSuccess?: () => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateRequestDetailSupplier', requestDetailSupplierId],
    mutationFn: (params: UpdateRequestDetailSupplierInput) =>
      client
        .collection<RequestDetailSupplierData>('requestDetailSupplier')
        .update(requestDetailSupplierId, params, {
          expand: 'supplier,requestDetail.detail'
        }),
    onSuccess: async (record) => {
      onSuccess?.();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAllRequestDetailSuppliersKey(record.requestDetail),
        }),
        queryClient.invalidateQueries({
          queryKey: getRequestByIdKey(
            record.expand.requestDetail.request
          )
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
