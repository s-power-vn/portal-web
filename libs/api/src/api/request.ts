import type {
  DetailResponse,
  IssueRecord,
  IssueResponse,
  ProjectResponse,
  RequestDetailResponse,
  RequestResponse,
  SupplierResponse
} from 'portal-core';
import {
  Collections,
  IssueDeadlineStatusOptions,
  IssueTypeOptions,
  client
} from 'portal-core';
import type { InferType } from 'yup';
import { number, object, string } from 'yup';

import { router } from 'react-query-kit';

import type { UserData } from './employee';

export type RequestDetailData = RequestDetailResponse & {
  expand: {
    request: RequestResponse;
    detail: DetailResponse;
    supplier: SupplierResponse;
  };
};

export type RequestData = RequestResponse & {
  expand: {
    project: ProjectResponse;
    requestDetail_via_request: RequestDetailData[];
    issue: IssueResponse & {
      expand: {
        createdBy: UserData;
        assignee: UserData;
      };
    };
  };
};

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
          'contract_via_request.supplier,' +
          'contract_via_request.contractItem_via_contract,' +
          'issue.createdBy,' +
          'issue.createdBy.department,' +
          'issue.assignee'
      })
  }),
  byIssueId: router.query({
    fetcher: async (issueId: string) => {
      try {
        return await client
          .collection<RequestData>(Collections.Request)
          .getFirstListItem(`issue = "${issueId}"`, {
            expand:
              'requestDetail_via_request.detail,' +
              'contract_via_request.supplier,' +
              'contract_via_request.contractItem_via_contract,' +
              'issue.createdBy,' +
              'issue.createdBy.department,' +
              'issue.assignee,' +
              'project'
          });
      } catch (e) {
        console.log(e, issueId);
        return null;
      }
    }
  }),
  create: router.mutation({
    mutationFn: async (
      params: Omit<IssueRecord, 'startDate' | 'endDate' | 'type'> & {
        code: string;
        startDate?: Date;
        endDate?: Date;
        details: {
          level?: string;
          id?: string;
          index?: string;
          requestVolume?: number;
          title?: string;
          note?: string;
          unit?: string;
        }[];
      }
    ) => {
      const issue = await client.collection(Collections.Issue).create({
        ...params,
        type: IssueTypeOptions.Request,
        status: 'n1',
        createdBy: client.authStore.model?.id,
        assignee: client.authStore.model?.id,
        deadlineStatus: IssueDeadlineStatusOptions.Normal
      });

      const request = await client.collection(Collections.Request).create({
        ...params,
        issue: issue.id
      });

      await Promise.all(
        params.details.map(it => {
          if (it.level?.indexOf('e') !== -1) {
            return client.collection(Collections.RequestDetail).create(
              {
                request: request.id,
                detail: null,
                index: it.index,
                volume: it.requestVolume,
                customLevel: it.level,
                customTitle: it.title,
                customUnit: it.unit,
                note: it.note
              },
              {
                requestKey: null
              }
            );
          } else {
            return client.collection(Collections.RequestDetail).create(
              {
                request: request.id,
                detail: it.id,
                index: it.index,
                volume: it.requestVolume,
                note: it.note
              },
              {
                requestKey: null
              }
            );
          }
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
  updateInfo: router.mutation({
    mutationFn: async (params: {
      id: string;
      code: string;
      title: string;
      startDate: Date;
      endDate: Date;
    }) => {
      const request = await client
        .collection(Collections.Request)
        .getOne(params.id);

      await client.collection(Collections.Issue).update(request.issue, {
        title: params.title,
        startDate: params.startDate,
        endDate: params.endDate
      });

      return client.collection(Collections.Request).update(params.id, {
        code: params.code
      });
    }
  }),
  userInfo: router.query({
    fetcher: async (projectId: string) => {
      try {
        return await client
          .collection(Collections.RequestUserInfo)
          .getFirstListItem(
            `p = "${projectId}" && assignee = "${client.authStore.model?.id}"`,
            {
              requestKey: null
            }
          );
      } catch (e) {
        return null;
      }
    }
  })
});

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
          expand: 'request,detail,request_via_requestDetail.request'
        })
  }),
  updateVolume: router.mutation({
    mutationFn: (params: { requestDetailId: string }) =>
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
