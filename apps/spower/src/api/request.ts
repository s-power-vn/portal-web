import _ from 'lodash';
import { InferType, number, object, string } from 'yup';

import { router } from 'react-query-kit';

import {
  Collections,
  DetailResponse,
  IssueDeadlineStatusOptions,
  IssueRecord,
  IssueResponse,
  IssueStatusOptions,
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
    supplier: SupplierResponse;
    requestDetailSupplier_via_requestDetail: RequestDetailSupplierData[];
  };
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
          'requestDetail_via_request.supplier,' +
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
            'issue.createdBy.department,' +
            'issue.assignee'
        })
  }),
  create: router.mutation({
    mutationFn: async (
      params: Omit<IssueRecord, 'startDate' | 'endDate'> & {
        startDate?: Date;
        endDate?: Date;
        details: {
          id?: string;
          requestVolume?: number;
        }[];
      }
    ) => {
      const issue = await client.collection(Collections.Issue).create({
        ...params,
        type: IssueTypeOptions.Request,
        createdBy: client.authStore.model?.id,
        assignee: client.authStore.model?.id,
        deadlineStatus: IssueDeadlineStatusOptions.Normal,
        status: IssueStatusOptions.Working
      });

      const request = await client.collection(Collections.Request).create({
        ...params,
        issue: issue.id,
        status: RequestStatusOptions.A1
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
      return Promise.all([
        client.collection(Collections.Request).update(params.id, {
          status: RequestStatusOptions.A1
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
      return Promise.all([
        client.collection(Collections.Request).update(params.id, {
          status: RequestStatusOptions.A1
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
          filter: `request = "${requestId}"`,
          expand: 'request'
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
  }),
  update: router.mutation({
    mutationFn: async (params: {
      id: string;
      issue: string;
      assignee: string;
      status: string;
      note?: string;
    }) => {
      const { assignee, note, ...payload } = params;

      await client.collection(Collections.Issue).update(params.issue, {
        assignee,
        lastAssignee: client.authStore.model?.id
      });

      if (note) {
        await client.collection(Collections.Comment).create({
          content: note,
          issue: params.issue,
          createdBy: client.authStore.model?.id
        });
      }

      return client.collection(Collections.Request).update(params.id, payload);
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

export const UpdateRequestDetailVolumeSchema = object().shape({
  volume: number()
    .required('Hãy nhập khối lượng yêu cầu')
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số')
    .moreThan(0, 'Khối lượng không thể <= 0')
});

export type UpdateRequestDetailVolumeInput = InferType<
  typeof UpdateRequestDetailVolumeSchema
>;

export const UpdateRequestDetailPriceSchema = object().shape({
  supplier: string().required('Hãy chọn nhà cung cấp'),
  price: number()
    .required('Hãy nhập đơn giá nhà cung cấp')
    .transform((_, originalValue) =>
      Number(originalValue?.toString().replace(/,/g, '.'))
    )
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .typeError('Sai định dạng số')
    .moreThan(0, 'Đơn giá không thể <= 0')
});

export type UpdateRequestDetailPriceInput = InferType<
  typeof UpdateRequestDetailPriceSchema
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
  updateVolume: router.mutation({
    mutationFn: (
      params: UpdateRequestDetailVolumeInput & {
        requestDetailId: string;
      }
    ) =>
      client
        .collection<RequestDetailData>(Collections.RequestDetail)
        .update(params.requestDetailId, params)
  }),
  updatePrice: router.mutation({
    mutationFn: (
      params: UpdateRequestDetailPriceInput & {
        requestDetailId: string;
      }
    ) =>
      client
        .collection<RequestDetailData>(Collections.RequestDetail)
        .update(params.requestDetailId, params)
  })
});
