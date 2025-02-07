import type {
  DetailResponse,
  IssueResponse,
  ProjectResponse,
  RequestDetailResponse,
  RequestResponse,
  SupplierResponse
} from 'portal-core';
import { Collections, client } from 'portal-core';
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
  listFinished: router.query({
    fetcher: async ({
      projectId,
      filter,
      pageIndex,
      pageSize
    }: {
      projectId: string;
      filter?: string;
      pageIndex?: number;
      pageSize?: number;
    }) => {
      return await client
        .collection<RequestData>(Collections.Request)
        .getList(pageIndex ?? 1, pageSize ?? 10, {
          filter: `issue.status = "n5-n7#1" && issue.deleted = false && issue.title ~ "${filter ?? ''}" && project = "${projectId}"`,
          sort: 'created',
          expand:
            'requestDetail_via_request.detail,' +
            'issue.createdBy,' +
            'issue.createdBy.department,' +
            'issue.assignee,' +
            'project'
        });
    }
  }),
  byId: router.query({
    fetcher: async (requestId?: string) => {
      if (!requestId) return null;

      return await client
        .collection<RequestData>(Collections.Request)
        .getOne(requestId, {
          expand:
            'requestDetail_via_request.detail,' +
            'issue.createdBy,' +
            'issue.createdBy.department,' +
            'issue.assignee,' +
            'project'
        });
    }
  }),
  byIssueId: router.query({
    fetcher: async (issueId: string) => {
      try {
        return await client
          .collection<RequestData>(Collections.Request)
          .getFirstListItem(`issue = "${issueId}"`, {
            expand:
              'requestDetail_via_request.detail,' +
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
    mutationFn: async (params: {
      title: string;
      project: string;
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
    }) => {
      return client.send('/create-request', {
        method: 'POST',
        body: params
      });
    }
  }),
  update: router.mutation({
    mutationFn: async (params: {
      id: string;
      title: string;
      project: string;
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
      deletedIds?: (string | undefined)[];
    }) => {
      return client.send('/update-request', {
        method: 'POST',
        body: params
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
