import _ from 'lodash';
import { InferType, array, boolean, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import {
  Collections,
  DetailResponse,
  IssueResponse,
  IssueTypeOptions,
  RequestDetailResponse,
  RequestDetailSupplierResponse,
  RequestResponse,
  RequestStatusOptions,
  SupplierResponse,
  client
} from '@storeo/core';

import { UserData } from './employee';
import { SettingData } from './setting';

export type RequestDetailSupplierData = RequestDetailSupplierResponse & {
  expand: {
    supplier: SupplierResponse;
    requestDetail: RequestDetailData;
  };
};

export type RequestDetailData = RequestDetailResponse & {
  expand: {
    detail: DetailResponse;
    requestDetailSupplier_via_requestDetail: RequestDetailSupplierData[];
  };
  supplier?: string;
  supplierUnitPrice?: number;
  supplierName?: string;
  supplierVolume?: number;
};

export type RequestData = RequestResponse & {
  expand: {
    requestDetail_via_request: RequestDetailData[];
    issue: IssueResponse & {
      expand: {
        createdBy: UserData;
        assignee: UserData;
      };
    };
  };
};

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

export const UpdateRequestSchema = object().shape({
  name: string().required('Hãy nhập nội dung'),
  details: array()
    .of(
      object().shape({
        id: string().required(),
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

export const CreateRequestDetailSupplierSchema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number().required('Hãy nhập đơn giá nhà cung cấp'),
  volume: number().required('Hãy nhập khối lượng nhà cung cấp')
});

export type CreateRequestDetailSupplierInput = InferType<
  typeof CreateRequestDetailSupplierSchema
>;

export const UpdateRequestDetailSupplierSchema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number().required('Hãy nhập đơn giá nhà cung cấp'),
  volume: number().required('Hãy nhập khối lượng nhà cung cấp')
});

export type UpdateRequestDetailSupplierInput = InferType<
  typeof UpdateRequestDetailSupplierSchema
>;

export const requestApi = router('request', {
  listFull: router.query({
    fetcher: (projectId: string) =>
      client.collection<RequestResponse>('request').getFullList({
        filter: `project = "${projectId}"`,
        sort: '-created'
      })
  }),
  byId: router.query({
    fetcher: (requestId: string) =>
      client.collection<RequestData>(Collections.Request).getOne(requestId, {
        expand:
          'requestDetail_via_request.detail,' +
          'requestDetail_via_request.requestDetailSupplier_via_requestDetail.supplier,' +
          'contract_via_request.supplier,' +
          'contract_via_request.contractItem_via_contract,' +
          'issue.createdBy,' +
          'issue.createdBy.department,' +
          'issue.assignee'
      })
  }),
  byIssueId: router.query({
    fetcher: (issueId: string) =>
      client
        .collection<RequestData>(Collections.Request)
        .getFirstListItem(`issue = "${issueId}"`, {
          expand:
            'requestDetail_via_request.detail,' +
            'requestDetail_via_request.requestDetailSupplier_via_requestDetail.supplier,' +
            'contract_via_request.supplier,' +
            'contract_via_request.contractItem_via_contract,' +
            'issue.createdBy,' +
            'issue.createdBy.department'
        })
  }),
  create: router.mutation({
    mutationFn: async (params: CreateRequestInput & { projectId: string }) => {
      const issue = await client.collection(Collections.Issue).create({
        project: params.projectId,
        title: params.name,
        type: IssueTypeOptions.Request,
        createdBy: client.authStore.model?.id,
        assignee: client.authStore.model?.id
      });

      const request = await client.collection(Collections.Request).create({
        project: params.projectId,
        issue: issue.id,
        status: RequestStatusOptions.ToDo
      });

      await Promise.all(
        params.details.map(it => {
          return client.collection(Collections.RequestDetail).create(
            {
              request: request.id,
              detail: it.id,
              volume: it.requestVolume
            },
            {
              requestKey: null
            }
          );
        })
      );

      return request;
    }
  }),
  update: router.mutation({
    mutationFn: (params: UpdateRequestInput & { requestId: string }) => {
      const { requestId, ...data } = params;

      return Promise.all([
        ...params.details
          .filter(detail => !detail.hasChild)
          .map(detail =>
            client.collection(Collections.RequestDetail).update(detail.id, {
              volume: detail.requestVolume
            })
          ),
        client.collection(Collections.Request).update(requestId, data)
      ]);
    }
  }),
  delete: router.mutation({
    mutationFn: async (requestId: string) => {
      const request = await client
        .collection(Collections.Request)
        .getOne(requestId);
      await client.collection(Collections.Issue).delete(request.issue);
    }
  }),
  approve: router.mutation({
    mutationFn: async (params: RequestData) => {
      const status =
        params.status === RequestStatusOptions.ToDo
          ? RequestStatusOptions.VolumeDone
          : RequestStatusOptions.Done;
      return Promise.all([
        client.collection(Collections.Request).update(params.id, {
          status
        }),
        client.collection(Collections.Issue).update(params.issue, {
          assignee: params.expand.issue.lastAssignee,
          lastAssignee: client.authStore.model?.id
        })
      ]);
    }
  }),
  reject: router.mutation({
    mutationFn: async (params: RequestData) => {
      const status = RequestStatusOptions.VolumeDone
        ? RequestStatusOptions.ToDo
        : RequestStatusOptions.VolumeDone;

      return Promise.all([
        client.collection(Collections.Request).update(params.id, {
          status
        }),
        client.collection(Collections.Issue).update(params.issue, {
          assignee: params.expand.issue.lastAssignee,
          lastAssignee: client.authStore.model?.id
        })
      ]);
    }
  }),
  listConfirmer: router.query({
    fetcher: (requestId: string) =>
      client.collection(Collections.RequestConfirm).getFullList({
        filter: `request = "${requestId}"`
      })
  }),
  checkConfirmer: router.query({
    fetcher: async (requestId: string) => {
      const confirmers = await client
        .collection<SettingData>(Collections.Setting)
        .getFullList({
          filter: `type = "Confirmer"`,
          expand: 'user'
        });

      if (
        _.filter(confirmers, it => {
          return it.expand.user.id === client.authStore.model?.id;
        }).length > 0
      ) {
        try {
          await client
            .collection(Collections.RequestConfirm)
            .getFirstListItem(
              `request = "${requestId}" && confirmer = "${client.authStore.model?.id}"`
            );
          return 2;
        } catch (e) {
          return 1;
        }
      }

      return 0;
    }
  }),
  checkApprover: router.query({
    fetcher: () => null
  }),
  checkEnableApprove: router.query({
    fetcher: async (requestId: string) => {
      const confirmers = await client
        .collection<SettingData>(Collections.Setting)
        .getFullList({
          filter: `type = "Confirmer"`
        });

      const requestConfirmers = await client
        .collection(Collections.RequestConfirm)
        .getFullList({
          filter: `request = "${requestId}"`
        });

      return confirmers.length === requestConfirmers.length;
    }
  }),
  sendToApprover: router.mutation({
    mutationFn: async (requestId: string) => {
      const approvers = await client
        .collection<SettingData>(Collections.Setting)
        .getFullList({
          filter: `type = "Approver"`,
          expand: 'user'
        });

      if (approvers.length > 0) {
        const request = await client
          .collection(Collections.Request)
          .getOne(requestId);

        await client.collection(Collections.Issue).update(request.issue, {
          assignee: approvers[0].expand.user.id,
          lastAssignee: client.authStore.model?.id
        });
      }
    }
  }),
  confirm: router.mutation({
    mutationFn: async (requestId: string) => {
      await client.collection(Collections.RequestConfirm).create({
        request: requestId,
        confirmer: client.authStore.model?.id
      });
    }
  }),
  unConfirm: router.mutation({
    mutationFn: async (requestId: string) => {
      const deleteItem = await client
        .collection(Collections.RequestConfirm)
        .getFirstListItem(
          `request = "${requestId}" && confirmer = "${client.authStore.model?.id}"`
        );
      await client.collection(Collections.RequestConfirm).delete(deleteItem.id);
    }
  })
});

export const requestDetailSupplierApi = router('requestDetailSupplier', {
  listFull: router.query({
    fetcher: (requestDetailId: string) =>
      client
        .collection<RequestDetailSupplierData>(
          Collections.RequestDetailSupplier
        )
        .getFullList({
          filter: `requestDetail = "${requestDetailId}"`,
          expand: 'supplier,requestDetail.detail'
        })
  }),
  byId: router.query({
    fetcher: (requestDetailSupplierId: string) =>
      client
        .collection<RequestDetailSupplierData>(
          Collections.RequestDetailSupplier
        )
        .getOne(requestDetailSupplierId, {
          expand: 'supplier,requestDetail.detail'
        })
  }),
  create: router.mutation({
    mutationFn: (
      params: CreateRequestDetailSupplierInput & { requestDetailId: string }
    ) =>
      client
        .collection<RequestDetailSupplierData>(
          Collections.RequestDetailSupplier
        )
        .create(
          {
            ...params,
            requestDetail: params.requestDetailId
          },
          {
            expand: 'supplier,requestDetail.detail'
          }
        )
  }),
  update: router.mutation({
    mutationFn: (
      params: UpdateRequestDetailSupplierInput & {
        requestDetailSupplierId: string;
      }
    ) =>
      client
        .collection<RequestDetailSupplierData>(
          Collections.RequestDetailSupplier
        )
        .update(params.requestDetailSupplierId, params)
  }),
  delete: router.mutation({
    mutationFn: (requestDetailSupplierId: string) =>
      client
        .collection<RequestDetailSupplierData>(
          Collections.RequestDetailSupplier
        )
        .delete(requestDetailSupplierId)
  })
});

export const UpdateRequestDetailSchema = object().shape({
  volume: number()
    .required('Hãy nhập khối lượng yêu cầu')
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số')
    .moreThan(0, 'Khối lượng không thể <= 0')
});

export type UpdateRequestDetailInput = InferType<
  typeof UpdateRequestDetailSchema
>;

export const requestDetailApi = router('requestDetail', {
  byId: router.query({
    fetcher: (requestDetailId: string) =>
      client
        .collection<RequestDetailData>(Collections.RequestDetail)
        .getOne(requestDetailId, {
          expand:
            'detail,requestDetailSupplier_via_requestDetail.supplier,request_via_requestDetail.request'
        })
  }),
  update: router.mutation({
    mutationFn: (
      params: UpdateRequestDetailInput & {
        requestDetailId: string;
      }
    ) =>
      client
        .collection<RequestDetailData>(Collections.RequestDetail)
        .update(params.requestDetailId, params)
  })
});
